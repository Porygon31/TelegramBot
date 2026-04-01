import { createServer } from "node:http";

import { createBot } from "./bot/bot";
import { env } from "./config/env";
import { ContentStore } from "./store/content-store";
import { createWebApp } from "./web/app";

// Démarre l'application complète en initialisant le stockage, le web et le bot.
const bootstrap = async (): Promise<void> => {
  const contentStore = new ContentStore(
    env.databaseFilePath,
    env.legacyDataFilePath,
    env.uploadsDirectoryPath
  );

  await contentStore.initialize();

  const webApp = createWebApp(contentStore);
  const server = createServer(webApp);
  const bot = createBot(contentStore);

  // Lance le serveur HTTP utilisé par la mini app et le panel.
  await new Promise<void>((resolve) => {
    server.listen(env.port, () => {
      console.log(`Serveur web démarré sur http://localhost:${env.port}`);
      resolve();
    });
  });

  // Lance le bot Telegram en mode polling pour simplifier le démarrage initial.
  await bot.launch();
  console.log("Bot Telegram démarré.");

  // Ferme proprement les services lorsque le processus reçoit un signal d'arrêt.
  const shutdown = async (): Promise<void> => {
    console.log("Arrêt en cours...");

    bot.stop("Arrêt du processus");

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await contentStore.close();

    process.exit(0);
  };

  process.once("SIGINT", () => {
    void shutdown();
  });

  process.once("SIGTERM", () => {
    void shutdown();
  });
};

// Capture l'erreur de démarrage et termine le processus avec un code d'échec.
bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
