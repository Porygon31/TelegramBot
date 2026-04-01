import { randomUUID } from "node:crypto";
import path from "node:path";

import express, { type Express, type NextFunction, type Request, type Response } from "express";
import session from "express-session";
import multer from "multer";

import { env } from "../config/env";
import { ContentStore } from "../store/content-store";
import { parseMediaItemInput, parseMenuItemInput, parsePricingItemInput, parseSettingsInput } from "./payloads";
import { renderAdminLoginHtml } from "./templates/admin-login";
import { renderAdminPanelHtml } from "./templates/admin-panel";
import { renderPublicAppHtml } from "./templates/public-app";

// Déclare l'état de session utilisé pour protéger l'interface d'administration.
declare module "express-session" {
  interface SessionData {
    isAuthenticated?: boolean;
  }
}

// Vérifie si la requête en cours vise une route API.
const isApiRequest = (request: Request): boolean => request.path.startsWith("/api/");

// Génère un nom de fichier stable et unique dans le dossier d'upload.
const createUploadFilename = (originalName: string): string => {
  const extension = path.extname(originalName) || ".bin";
  const safeExtension = extension.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();

  return `${Date.now()}-${randomUUID()}${safeExtension}`;
};

// Construit l'application Express qui sert la mini app premium et le panel d'administration.
export const createWebApp = (contentStore: ContentStore): Express => {
  const app = express();

  // Déclare la confiance proxy utile lorsqu'une URL publique HTTPS relaie le service.
  app.set("trust proxy", 1);

  // Prépare le middleware d'upload avec disque local et validation de type.
  const upload = multer({
    storage: multer.diskStorage({
      destination: (_request, _file, callback) => {
        callback(null, env.uploadsDirectoryPath);
      },
      filename: (_request, file, callback) => {
        callback(null, createUploadFilename(file.originalname));
      }
    }),
    limits: {
      fileSize: env.maxUploadSizeMb * 1024 * 1024
    },
    fileFilter: (_request, file, callback) => {
      const isSupportedFile =
        file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

      if (!isSupportedFile) {
        callback(new Error("Le fichier doit etre une image ou une video."));
        return;
      }

      callback(null, true);
    }
  });

  // Active le décodage JSON et formulaire pour les routes API et login.
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Expose les médias uploadés pour la mini app publique.
  app.use("/uploads", express.static(env.uploadsDirectoryPath));

  // Active une session simple pour sécuriser le panel de gestion.
  app.use(
    session({
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
      }
    })
  );

  // Exige une authentification valide sur toutes les routes admin protégées.
  const requireAuth = (request: Request, response: Response, next: NextFunction): void => {
    if (!request.session.isAuthenticated) {
      if (isApiRequest(request)) {
        response.status(401).json({ message: "Authentification requise." });
        return;
      }

      response.redirect("/admin/login");
      return;
    }

    next();
  };

  // Sert la mini app publique consommée depuis Telegram.
  app.get(["/", "/app"], (_request, response) => {
    response.type("html").send(renderPublicAppHtml());
  });

  // Expose un endpoint léger pour les checks de santé de la plateforme.
  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  // Expose le contenu public utilisé par la mini app et le bot.
  app.get("/api/public/content", async (_request, response) => {
    const content = await contentStore.getPublicContent();

    response.json(content);
  });

  // Affiche le formulaire de connexion du panel.
  app.get("/admin/login", (request, response) => {
    response.type("html").send(renderAdminLoginHtml(request.query.error === "1"));
  });

  // Traite la connexion administrateur avec les identifiants configurés.
  app.post("/admin/login", (request, response) => {
    const username = String(request.body.username ?? "");
    const password = String(request.body.password ?? "");

    if (username === env.adminUsername && password === env.adminPassword) {
      request.session.isAuthenticated = true;
      response.redirect("/admin");
      return;
    }

    response.redirect("/admin/login?error=1");
  });

  // Termine la session d'administration en cours.
  app.post("/admin/logout", (request, response) => {
    request.session.destroy(() => {
      response.redirect("/admin/login");
    });
  });

  // Sert l'interface HTML du panel une fois l'utilisateur connecté.
  app.get("/admin", requireAuth, (_request, response) => {
    response.type("html").send(renderAdminPanelHtml());
  });

  // Renvoie l'intégralité du contenu administrable ainsi que les métriques dashboard.
  app.get("/api/admin/content", requireAuth, async (_request, response) => {
    const content = await contentStore.getAdminContent();

    response.json(content);
  });

  // Met à jour les paramètres généraux de l'application.
  app.put("/api/admin/settings", requireAuth, async (request, response) => {
    const content = await contentStore.updateSettings(parseSettingsInput(request.body));

    response.json(content);
  });

  // Ajoute un nouvel élément dans la section menu.
  app.post("/api/admin/menu", requireAuth, async (request, response) => {
    const content = await contentStore.addMenuItem(parseMenuItemInput(request.body));

    response.status(201).json(content);
  });

  // Met à jour un élément existant dans la section menu.
  app.put("/api/admin/menu/:id", requireAuth, async (request, response) => {
    const content = await contentStore.updateMenuItem(
      String(request.params.id),
      parseMenuItemInput(request.body)
    );

    response.json(content);
  });

  // Supprime un élément existant dans la section menu.
  app.delete("/api/admin/menu/:id", requireAuth, async (request, response) => {
    const content = await contentStore.deleteMenuItem(String(request.params.id));

    response.json(content);
  });

  // Ajoute un nouveau média dans la galerie publique.
  app.post("/api/admin/media", requireAuth, async (request, response) => {
    const content = await contentStore.addMediaItem(parseMediaItemInput(request.body));

    response.status(201).json(content);
  });

  // Met à jour un média existant.
  app.put("/api/admin/media/:id", requireAuth, async (request, response) => {
    const content = await contentStore.updateMediaItem(
      String(request.params.id),
      parseMediaItemInput(request.body)
    );

    response.json(content);
  });

  // Supprime un média existant.
  app.delete("/api/admin/media/:id", requireAuth, async (request, response) => {
    const content = await contentStore.deleteMediaItem(String(request.params.id));

    response.json(content);
  });

  // Ajoute une nouvelle ligne tarifaire.
  app.post("/api/admin/pricing", requireAuth, async (request, response) => {
    const content = await contentStore.addPricingItem(parsePricingItemInput(request.body));

    response.status(201).json(content);
  });

  // Met à jour une ligne tarifaire existante.
  app.put("/api/admin/pricing/:id", requireAuth, async (request, response) => {
    const content = await contentStore.updatePricingItem(
      String(request.params.id),
      parsePricingItemInput(request.body)
    );

    response.json(content);
  });

  // Supprime une ligne tarifaire existante.
  app.delete("/api/admin/pricing/:id", requireAuth, async (request, response) => {
    const content = await contentStore.deletePricingItem(String(request.params.id));

    response.json(content);
  });

  // Reçoit un fichier média et renvoie son URL publique pour réutilisation immédiate.
  app.post("/api/admin/uploads", requireAuth, upload.single("file"), (request, response) => {
    if (!request.file) {
      throw new Error("Aucun fichier n'a ete recu.");
    }

    const mediaType = request.file.mimetype.startsWith("video/") ? "video" : "photo";

    response.status(201).json({
      url: `${env.publicBaseUrl}/uploads/${request.file.filename}`,
      thumbnailUrl: mediaType === "photo" ? `${env.publicBaseUrl}/uploads/${request.file.filename}` : null,
      storagePath: request.file.filename,
      mediaType,
      sourceType: "upload"
    });
  });

  // Centralise la gestion des erreurs applicatives pour éviter les réponses silencieuses.
  app.use((error: unknown, request: Request, response: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
    const statusCode = message === "Authentification requise." ? 401 : 400;

    if (isApiRequest(request)) {
      response.status(statusCode).json({ message });
      return;
    }

    response.status(statusCode).type("html").send(`<pre>${message}</pre>`);
  });

  return app;
};
