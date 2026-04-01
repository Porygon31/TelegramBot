import dotenv from "dotenv";
import path from "node:path";

// Charge les variables d'environnement depuis le fichier .env local.
dotenv.config();

// Lit une variable obligatoire et arrête l'application si elle est absente.
const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable d'environnement ${name} est obligatoire.`);
  }

  return value;
};

// Expose toute la configuration centralisée de l'application.
export const env = {
  botToken: requireEnv("BOT_TOKEN"),
  publicBaseUrl: requireEnv("PUBLIC_BASE_URL"),
  port: Number(process.env.PORT ?? 3000),
  sessionSecret: requireEnv("SESSION_SECRET"),
  adminUsername: requireEnv("ADMIN_USERNAME"),
  adminPassword: requireEnv("ADMIN_PASSWORD"),
  adminIds: (process.env.ADMIN_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0),
  databaseFilePath: path.resolve(
    process.cwd(),
    process.env.DATABASE_FILE_PATH ?? "./data/telegram-premium.sqlite"
  ),
  legacyDataFilePath: path.resolve(process.cwd(), process.env.DATA_FILE_PATH ?? "./data/content.json"),
  uploadsDirectoryPath: path.resolve(process.cwd(), process.env.UPLOADS_DIRECTORY_PATH ?? "./uploads"),
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB ?? 25)
};
