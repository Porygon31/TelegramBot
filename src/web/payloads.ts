import type {
  AppSettings,
  MediaItemInput,
  MediaSourceType,
  MenuItemInput,
  PricingItemInput
} from "../types/content";

// Vérifie qu'une valeur inconnue peut être lue comme un objet simple.
const asRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Le payload est invalide.");
  }

  return value as Record<string, unknown>;
};

// Lit une chaîne obligatoire et renvoie une erreur si elle est absente.
const readRequiredString = (payload: Record<string, unknown>, fieldName: string): string => {
  const value = payload[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Le champ ${fieldName} est obligatoire.`);
  }

  return value.trim();
};

// Lit une chaîne optionnelle et normalise la valeur vide à null.
const readOptionalString = (payload: Record<string, unknown>, fieldName: string): string | null => {
  const value = payload[fieldName];

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
};

// Convertit une valeur de formulaire ou JSON vers un booléen.
const readBooleanish = (
  payload: Record<string, unknown>,
  fieldName: string,
  fallback: boolean
): boolean => {
  const value = payload[fieldName];

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "true" || normalizedValue === "1" || normalizedValue === "yes") {
      return true;
    }

    if (normalizedValue === "false" || normalizedValue === "0" || normalizedValue === "no") {
      return false;
    }
  }

  return fallback;
};

// Convertit une valeur de formulaire ou JSON vers un entier.
const readIntegerish = (
  payload: Record<string, unknown>,
  fieldName: string,
  fallback: number
): number => {
  const value = payload[fieldName];

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return Math.trunc(parsedValue);
    }
  }

  return fallback;
};

// Valide le type de média attendu par l'application.
const readMediaType = (payload: Record<string, unknown>): "photo" | "video" => {
  const type = readRequiredString(payload, "type");

  if (type !== "photo" && type !== "video") {
    throw new Error("Le type de media doit etre photo ou video.");
  }

  return type;
};

// Valide la provenance du média attendu par l'application.
const readMediaSourceType = (payload: Record<string, unknown>): MediaSourceType => {
  const sourceType = readOptionalString(payload, "sourceType") ?? "url";

  if (sourceType !== "url" && sourceType !== "upload") {
    throw new Error("La source du media doit etre url ou upload.");
  }

  return sourceType;
};

// Convertit un payload brut vers les paramètres d'affichage généraux.
export const parseSettingsInput = (payload: unknown): AppSettings => {
  const record = asRecord(payload);

  return {
    brandName: readRequiredString(record, "brandName"),
    heroTitle: readRequiredString(record, "heroTitle"),
    heroDescription: readRequiredString(record, "heroDescription"),
    announcement: readRequiredString(record, "announcement"),
    contactLabel: readRequiredString(record, "contactLabel"),
    contactUrl: readRequiredString(record, "contactUrl"),
    supportLabel: readRequiredString(record, "supportLabel"),
    supportUrl: readRequiredString(record, "supportUrl")
  };
};

// Convertit un payload brut vers un élément de menu premium.
export const parseMenuItemInput = (payload: unknown): MenuItemInput => {
  const record = asRecord(payload);

  return {
    title: readRequiredString(record, "title"),
    description: readRequiredString(record, "description"),
    category: readRequiredString(record, "category"),
    availability: readRequiredString(record, "availability"),
    highlight: readRequiredString(record, "highlight"),
    isFeatured: readBooleanish(record, "isFeatured", false),
    isPublished: readBooleanish(record, "isPublished", true),
    sortOrder: readIntegerish(record, "sortOrder", 1)
  };
};

// Convertit un payload brut vers un média premium.
export const parseMediaItemInput = (payload: unknown): MediaItemInput => {
  const record = asRecord(payload);

  return {
    title: readRequiredString(record, "title"),
    type: readMediaType(record),
    url: readRequiredString(record, "url"),
    thumbnailUrl: readOptionalString(record, "thumbnailUrl"),
    description: readRequiredString(record, "description"),
    sourceType: readMediaSourceType(record),
    storagePath: readOptionalString(record, "storagePath"),
    isFeatured: readBooleanish(record, "isFeatured", false),
    isPublished: readBooleanish(record, "isPublished", true),
    sortOrder: readIntegerish(record, "sortOrder", 1)
  };
};

// Convertit un payload brut vers une ligne tarifaire premium.
export const parsePricingItemInput = (payload: unknown): PricingItemInput => {
  const record = asRecord(payload);

  return {
    title: readRequiredString(record, "title"),
    price: readRequiredString(record, "price"),
    details: readRequiredString(record, "details"),
    tag: readRequiredString(record, "tag"),
    isFeatured: readBooleanish(record, "isFeatured", false),
    isPublished: readBooleanish(record, "isPublished", true),
    sortOrder: readIntegerish(record, "sortOrder", 1)
  };
};
