import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { defaultContent } from "../data/default-content";
import type {
  AdminContentData,
  AppSettings,
  ContentData,
  DashboardStats,
  MediaItem,
  MediaItemInput,
  MediaSourceType,
  MenuItem,
  MenuItemInput,
  PricingItem,
  PricingItemInput,
  PublicContentData,
  PublicStats
} from "../types/content";

// Décrit le type de ligne renvoyé pour les paramètres généraux.
interface SettingsRow {
  brand_name: string;
  hero_title: string;
  hero_description: string;
  announcement: string;
  contact_label: string;
  contact_url: string;
  support_label: string;
  support_url: string;
}

// Décrit le type commun aux lignes de contenu stockées dans SQLite.
interface ItemRow {
  id: string;
  title: string;
  description?: string;
  category?: string;
  availability?: string;
  highlight?: string;
  type?: "photo" | "video";
  url?: string;
  thumbnail_url?: string | null;
  source_type?: MediaSourceType;
  storage_path?: string | null;
  price?: string;
  details?: string;
  tag?: string;
  is_featured: number;
  is_published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Indique si une valeur inconnue peut être manipulée comme un objet simple.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Convertit un booléen vers sa représentation SQLite.
const toSqliteBoolean = (value: boolean): number => (value ? 1 : 0);

// Convertit une valeur SQLite vers un booléen JavaScript.
const fromSqliteBoolean = (value: number): boolean => value === 1;

// Retourne un horodatage ISO cohérent pour les créations et mises à jour.
const createTimestamp = (): string => new Date().toISOString();

// Sécurise la lecture d'une chaîne depuis une structure inconnue.
const readString = (record: Record<string, unknown>, key: string, fallback: string): string => {
  const value = record[key];

  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
};

// Sécurise la lecture d'un booléen depuis une structure inconnue.
const readBoolean = (record: Record<string, unknown>, key: string, fallback: boolean): boolean => {
  const value = record[key];

  return typeof value === "boolean" ? value : fallback;
};

// Sécurise la lecture d'un entier depuis une structure inconnue.
const readNumber = (record: Record<string, unknown>, key: string, fallback: number): number => {
  const value = record[key];

  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

// Normalise une URL optionnelle pour les miniatures.
const normalizeNullableString = (value: string | null | undefined): string | null =>
  value && value.trim().length > 0 ? value.trim() : null;

// Calcule les statistiques visibles côté mini app.
const createPublicStats = (content: ContentData): PublicStats => ({
  menuCount: content.menuItems.length,
  mediaCount: content.mediaItems.length,
  pricingCount: content.pricingItems.length,
  featuredCount:
    content.menuItems.filter((item) => item.isFeatured).length +
    content.mediaItems.filter((item) => item.isFeatured).length +
    content.pricingItems.filter((item) => item.isFeatured).length
});

// Calcule les statistiques détaillées visibles dans le panel d'administration.
const createDashboardStats = (content: ContentData): DashboardStats => ({
  ...createPublicStats(content),
  publishedMenuItems: content.menuItems.filter((item) => item.isPublished).length,
  publishedMediaItems: content.mediaItems.filter((item) => item.isPublished).length,
  publishedPricingItems: content.pricingItems.filter((item) => item.isPublished).length,
  uploadedMediaItems: content.mediaItems.filter((item) => item.sourceType === "upload").length
});

// Centralise les accès au catalogue premium stocké dans SQLite.
export class ContentStore {
  private readonly database: DatabaseSync;

  public constructor(
    private readonly filePath: string,
    private readonly legacyDataFilePath: string,
    private readonly uploadsDirectoryPath: string
  ) {
    mkdirSync(path.dirname(this.filePath), { recursive: true });
    mkdirSync(this.uploadsDirectoryPath, { recursive: true });
    this.database = new DatabaseSync(this.filePath);
  }

  // Initialise le schéma SQLite et injecte les données de départ au premier démarrage.
  public async initialize(): Promise<void> {
    this.database.exec(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        brand_name TEXT NOT NULL,
        hero_title TEXT NOT NULL,
        hero_description TEXT NOT NULL,
        announcement TEXT NOT NULL,
        contact_label TEXT NOT NULL,
        contact_url TEXT NOT NULL,
        support_label TEXT NOT NULL,
        support_url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        availability TEXT NOT NULL,
        highlight TEXT NOT NULL,
        is_featured INTEGER NOT NULL,
        is_published INTEGER NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS media_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        description TEXT NOT NULL,
        source_type TEXT NOT NULL,
        storage_path TEXT,
        is_featured INTEGER NOT NULL,
        is_published INTEGER NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pricing_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        price TEXT NOT NULL,
        details TEXT NOT NULL,
        tag TEXT NOT NULL,
        is_featured INTEGER NOT NULL,
        is_published INTEGER NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const settingsCount = this.database
      .prepare("SELECT COUNT(*) AS count FROM settings")
      .get() as { count: number };

    if (settingsCount.count === 0) {
      this.seedContent(await this.loadSeedContent());
    }
  }

  // Ferme proprement la connexion SQLite.
  public async close(): Promise<void> {
    this.database.close();
  }

  // Retourne le contenu public filtré pour la mini app et le bot.
  public async getPublicContent(): Promise<PublicContentData> {
    const content = this.readContent(true);

    return {
      ...content,
      stats: createPublicStats(content)
    };
  }

  // Retourne le contenu complet nécessaire au panel d'administration.
  public async getAdminContent(): Promise<AdminContentData> {
    const content = this.readContent(false);

    return {
      ...content,
      stats: createDashboardStats(content)
    };
  }

  // Met à jour les paramètres généraux de l'application.
  public async updateSettings(settings: AppSettings): Promise<AdminContentData> {
    this.database
      .prepare(
        `
          UPDATE settings
          SET brand_name = ?, hero_title = ?, hero_description = ?, announcement = ?,
              contact_label = ?, contact_url = ?, support_label = ?, support_url = ?
          WHERE id = 1
        `
      )
      .run(
        settings.brandName,
        settings.heroTitle,
        settings.heroDescription,
        settings.announcement,
        settings.contactLabel,
        settings.contactUrl,
        settings.supportLabel,
        settings.supportUrl
      );

    return this.getAdminContent();
  }

  // Ajoute un élément de menu premium.
  public async addMenuItem(item: MenuItemInput): Promise<AdminContentData> {
    const timestamp = createTimestamp();

    this.database
      .prepare(
        `
          INSERT INTO menu_items (
            id, title, description, category, availability, highlight,
            is_featured, is_published, sort_order, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        randomUUID(),
        item.title,
        item.description,
        item.category,
        item.availability,
        item.highlight,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        timestamp,
        timestamp
      );

    return this.getAdminContent();
  }

  // Met à jour un élément de menu existant.
  public async updateMenuItem(id: string, item: MenuItemInput): Promise<AdminContentData> {
    this.database
      .prepare(
        `
          UPDATE menu_items
          SET title = ?, description = ?, category = ?, availability = ?, highlight = ?,
              is_featured = ?, is_published = ?, sort_order = ?, updated_at = ?
          WHERE id = ?
        `
      )
      .run(
        item.title,
        item.description,
        item.category,
        item.availability,
        item.highlight,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        createTimestamp(),
        id
      );

    return this.getAdminContent();
  }

  // Supprime un élément de menu identifié.
  public async deleteMenuItem(id: string): Promise<AdminContentData> {
    this.database.prepare("DELETE FROM menu_items WHERE id = ?").run(id);

    return this.getAdminContent();
  }

  // Ajoute un média premium.
  public async addMediaItem(item: MediaItemInput): Promise<AdminContentData> {
    const timestamp = createTimestamp();

    this.database
      .prepare(
        `
          INSERT INTO media_items (
            id, title, type, url, thumbnail_url, description, source_type, storage_path,
            is_featured, is_published, sort_order, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        randomUUID(),
        item.title,
        item.type,
        item.url,
        normalizeNullableString(item.thumbnailUrl),
        item.description,
        item.sourceType,
        normalizeNullableString(item.storagePath),
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        timestamp,
        timestamp
      );

    return this.getAdminContent();
  }

  // Met à jour un média existant.
  public async updateMediaItem(id: string, item: MediaItemInput): Promise<AdminContentData> {
    const currentMedia = this.database
      .prepare("SELECT storage_path, source_type FROM media_items WHERE id = ?")
      .get(id) as { storage_path: string | null; source_type: MediaSourceType } | undefined;

    if (
      currentMedia?.source_type === "upload" &&
      currentMedia.storage_path &&
      currentMedia.storage_path !== item.storagePath
    ) {
      await this.removeStoredFile(currentMedia.storage_path);
    }

    this.database
      .prepare(
        `
          UPDATE media_items
          SET title = ?, type = ?, url = ?, thumbnail_url = ?, description = ?,
              source_type = ?, storage_path = ?, is_featured = ?, is_published = ?,
              sort_order = ?, updated_at = ?
          WHERE id = ?
        `
      )
      .run(
        item.title,
        item.type,
        item.url,
        normalizeNullableString(item.thumbnailUrl),
        item.description,
        item.sourceType,
        normalizeNullableString(item.storagePath),
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        createTimestamp(),
        id
      );

    return this.getAdminContent();
  }

  // Supprime un média et son fichier local éventuel.
  public async deleteMediaItem(id: string): Promise<AdminContentData> {
    const currentMedia = this.database
      .prepare("SELECT storage_path, source_type FROM media_items WHERE id = ?")
      .get(id) as { storage_path: string | null; source_type: MediaSourceType } | undefined;

    this.database.prepare("DELETE FROM media_items WHERE id = ?").run(id);

    if (currentMedia?.source_type === "upload" && currentMedia.storage_path) {
      await this.removeStoredFile(currentMedia.storage_path);
    }

    return this.getAdminContent();
  }

  // Ajoute une ligne tarifaire premium.
  public async addPricingItem(item: PricingItemInput): Promise<AdminContentData> {
    const timestamp = createTimestamp();

    this.database
      .prepare(
        `
          INSERT INTO pricing_items (
            id, title, price, details, tag, is_featured, is_published,
            sort_order, created_at, updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        randomUUID(),
        item.title,
        item.price,
        item.details,
        item.tag,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        timestamp,
        timestamp
      );

    return this.getAdminContent();
  }

  // Met à jour une ligne tarifaire existante.
  public async updatePricingItem(id: string, item: PricingItemInput): Promise<AdminContentData> {
    this.database
      .prepare(
        `
          UPDATE pricing_items
          SET title = ?, price = ?, details = ?, tag = ?, is_featured = ?,
              is_published = ?, sort_order = ?, updated_at = ?
          WHERE id = ?
        `
      )
      .run(
        item.title,
        item.price,
        item.details,
        item.tag,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        createTimestamp(),
        id
      );

    return this.getAdminContent();
  }

  // Supprime une ligne tarifaire identifiée.
  public async deletePricingItem(id: string): Promise<AdminContentData> {
    this.database.prepare("DELETE FROM pricing_items WHERE id = ?").run(id);

    return this.getAdminContent();
  }

  // Lit l'état courant du catalogue, avec ou sans filtre de publication.
  private readContent(publishedOnly: boolean): ContentData {
    const settingsRow = this.database
      .prepare(
        `
          SELECT brand_name, hero_title, hero_description, announcement,
                 contact_label, contact_url, support_label, support_url
          FROM settings
          WHERE id = 1
        `
      )
      .get() as unknown as SettingsRow;

    const whereClause = publishedOnly ? "WHERE is_published = 1" : "";

    const menuRows = this.database
      .prepare(
        `
          SELECT id, title, description, category, availability, highlight,
                 is_featured, is_published, sort_order, created_at, updated_at
          FROM menu_items
          ${whereClause}
          ORDER BY sort_order ASC, updated_at DESC
        `
      )
      .all() as unknown as ItemRow[];

    const mediaRows = this.database
      .prepare(
        `
          SELECT id, title, type, url, thumbnail_url, description, source_type, storage_path,
                 is_featured, is_published, sort_order, created_at, updated_at
          FROM media_items
          ${whereClause}
          ORDER BY sort_order ASC, updated_at DESC
        `
      )
      .all() as unknown as ItemRow[];

    const pricingRows = this.database
      .prepare(
        `
          SELECT id, title, price, details, tag,
                 is_featured, is_published, sort_order, created_at, updated_at
          FROM pricing_items
          ${whereClause}
          ORDER BY sort_order ASC, updated_at DESC
        `
      )
      .all() as unknown as ItemRow[];

    return {
      settings: {
        brandName: settingsRow.brand_name,
        heroTitle: settingsRow.hero_title,
        heroDescription: settingsRow.hero_description,
        announcement: settingsRow.announcement,
        contactLabel: settingsRow.contact_label,
        contactUrl: settingsRow.contact_url,
        supportLabel: settingsRow.support_label,
        supportUrl: settingsRow.support_url
      },
      menuItems: menuRows.map((row) => this.mapMenuRow(row)),
      mediaItems: mediaRows.map((row) => this.mapMediaRow(row)),
      pricingItems: pricingRows.map((row) => this.mapPricingRow(row))
    };
  }

  // Convertit une ligne SQLite en objet MenuItem typé.
  private mapMenuRow(row: ItemRow): MenuItem {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      category: row.category ?? "",
      availability: row.availability ?? "",
      highlight: row.highlight ?? "",
      isFeatured: fromSqliteBoolean(row.is_featured),
      isPublished: fromSqliteBoolean(row.is_published),
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Convertit une ligne SQLite en objet MediaItem typé.
  private mapMediaRow(row: ItemRow): MediaItem {
    return {
      id: row.id,
      title: row.title,
      type: row.type ?? "photo",
      url: row.url ?? "",
      thumbnailUrl: row.thumbnail_url ?? null,
      description: row.description ?? "",
      sourceType: row.source_type ?? "url",
      storagePath: row.storage_path ?? null,
      isFeatured: fromSqliteBoolean(row.is_featured),
      isPublished: fromSqliteBoolean(row.is_published),
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Convertit une ligne SQLite en objet PricingItem typé.
  private mapPricingRow(row: ItemRow): PricingItem {
    return {
      id: row.id,
      title: row.title,
      price: row.price ?? "",
      details: row.details ?? "",
      tag: row.tag ?? "",
      isFeatured: fromSqliteBoolean(row.is_featured),
      isPublished: fromSqliteBoolean(row.is_published),
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Injecte les données de départ dans SQLite lors du premier lancement.
  private seedContent(content: ContentData): void {
    this.database.prepare("DELETE FROM settings").run();
    this.database.prepare("DELETE FROM menu_items").run();
    this.database.prepare("DELETE FROM media_items").run();
    this.database.prepare("DELETE FROM pricing_items").run();

    this.database
      .prepare(
        `
          INSERT INTO settings (
            id, brand_name, hero_title, hero_description, announcement,
            contact_label, contact_url, support_label, support_url
          )
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        content.settings.brandName,
        content.settings.heroTitle,
        content.settings.heroDescription,
        content.settings.announcement,
        content.settings.contactLabel,
        content.settings.contactUrl,
        content.settings.supportLabel,
        content.settings.supportUrl
      );

    const insertMenu = this.database.prepare(
      `
        INSERT INTO menu_items (
          id, title, description, category, availability, highlight,
          is_featured, is_published, sort_order, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    );

    const insertMedia = this.database.prepare(
      `
        INSERT INTO media_items (
          id, title, type, url, thumbnail_url, description, source_type, storage_path,
          is_featured, is_published, sort_order, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    );

    const insertPricing = this.database.prepare(
      `
        INSERT INTO pricing_items (
          id, title, price, details, tag, is_featured, is_published,
          sort_order, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    );

    for (const item of content.menuItems) {
      insertMenu.run(
        item.id,
        item.title,
        item.description,
        item.category,
        item.availability,
        item.highlight,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        item.createdAt,
        item.updatedAt
      );
    }

    for (const item of content.mediaItems) {
      insertMedia.run(
        item.id,
        item.title,
        item.type,
        item.url,
        normalizeNullableString(item.thumbnailUrl),
        item.description,
        item.sourceType,
        normalizeNullableString(item.storagePath),
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        item.createdAt,
        item.updatedAt
      );
    }

    for (const item of content.pricingItems) {
      insertPricing.run(
        item.id,
        item.title,
        item.price,
        item.details,
        item.tag,
        toSqliteBoolean(item.isFeatured),
        toSqliteBoolean(item.isPublished),
        item.sortOrder,
        item.createdAt,
        item.updatedAt
      );
    }
  }

  // Charge soit le contenu historique JSON, soit les données par défaut.
  private async loadSeedContent(): Promise<ContentData> {
    if (!existsSync(this.legacyDataFilePath)) {
      return defaultContent;
    }

    try {
      const rawContent = await fs.readFile(this.legacyDataFilePath, "utf-8");

      return this.normalizeLegacyContent(JSON.parse(rawContent));
    } catch {
      return defaultContent;
    }
  }

  // Reconvertit l'ancien format JSON en format premium complet.
  private normalizeLegacyContent(rawContent: unknown): ContentData {
    if (!isRecord(rawContent)) {
      return defaultContent;
    }

    const settingsSource = isRecord(rawContent.settings) ? rawContent.settings : {};
    const baseTimestamp = createTimestamp();

    const menuItems = Array.isArray(rawContent.menuItems)
      ? rawContent.menuItems
          .filter(isRecord)
          .map((item, index) => ({
            id: readString(item, "id", randomUUID()),
            title: readString(item, "title", `Offre ${index + 1}`),
            description: readString(item, "description", ""),
            category: readString(item, "category", "Offres"),
            availability: readString(item, "availability", "Disponible"),
            highlight: readString(item, "highlight", "A la une"),
            isFeatured: readBoolean(item, "isFeatured", index < 2),
            isPublished: readBoolean(item, "isPublished", true),
            sortOrder: readNumber(item, "sortOrder", index + 1),
            createdAt: readString(item, "createdAt", baseTimestamp),
            updatedAt: readString(item, "updatedAt", baseTimestamp)
          }))
      : defaultContent.menuItems;

    const mediaItems = Array.isArray(rawContent.mediaItems)
      ? rawContent.mediaItems.filter(isRecord).map<MediaItem>((item, index) => {
          const normalizedType: "photo" | "video" =
            readString(item, "type", "photo") === "video" ? "video" : "photo";
          const normalizedSourceType: MediaSourceType =
            readString(item, "sourceType", "url") === "upload" ? "upload" : "url";

          return {
            id: readString(item, "id", randomUUID()),
            title: readString(item, "title", `Media ${index + 1}`),
            type: normalizedType,
            url: readString(item, "url", ""),
            thumbnailUrl: normalizeNullableString(readString(item, "thumbnailUrl", "")),
            description: readString(item, "description", ""),
            sourceType: normalizedSourceType,
            storagePath: normalizeNullableString(readString(item, "storagePath", "")),
            isFeatured: readBoolean(item, "isFeatured", index < 2),
            isPublished: readBoolean(item, "isPublished", true),
            sortOrder: readNumber(item, "sortOrder", index + 1),
            createdAt: readString(item, "createdAt", baseTimestamp),
            updatedAt: readString(item, "updatedAt", baseTimestamp)
          };
        })
      : defaultContent.mediaItems;

    const pricingItems = Array.isArray(rawContent.pricingItems)
      ? rawContent.pricingItems
          .filter(isRecord)
          .map((item, index) => ({
            id: readString(item, "id", randomUUID()),
            title: readString(item, "title", `Tarif ${index + 1}`),
            price: readString(item, "price", "Sur devis"),
            details: readString(item, "details", ""),
            tag: readString(item, "tag", "Offre premium"),
            isFeatured: readBoolean(item, "isFeatured", index < 2),
            isPublished: readBoolean(item, "isPublished", true),
            sortOrder: readNumber(item, "sortOrder", index + 1),
            createdAt: readString(item, "createdAt", baseTimestamp),
            updatedAt: readString(item, "updatedAt", baseTimestamp)
          }))
      : defaultContent.pricingItems;

    return {
      settings: {
        brandName: readString(settingsSource, "brandName", defaultContent.settings.brandName),
        heroTitle: readString(settingsSource, "heroTitle", defaultContent.settings.heroTitle),
        heroDescription: readString(
          settingsSource,
          "heroDescription",
          defaultContent.settings.heroDescription
        ),
        announcement: readString(settingsSource, "announcement", defaultContent.settings.announcement),
        contactLabel: readString(settingsSource, "contactLabel", defaultContent.settings.contactLabel),
        contactUrl: readString(settingsSource, "contactUrl", defaultContent.settings.contactUrl),
        supportLabel: readString(settingsSource, "supportLabel", defaultContent.settings.supportLabel),
        supportUrl: readString(settingsSource, "supportUrl", defaultContent.settings.supportUrl)
      },
      menuItems,
      mediaItems,
      pricingItems
    };
  }

  // Supprime silencieusement un fichier uploadé devenu obsolète.
  private async removeStoredFile(fileName: string): Promise<void> {
    try {
      await fs.unlink(path.join(this.uploadsDirectoryPath, fileName));
    } catch {
      // Ignore volontairement l'absence du fichier pour éviter de bloquer l'admin.
    }
  }
}
