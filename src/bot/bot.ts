import { Markup, Telegraf } from "telegraf";

import { env } from "../config/env";
import { ContentStore } from "../store/content-store";
import type { MediaItem, MenuItem, PricingItem, PublicContentData } from "../types/content";

// Formate un élément de menu pour un affichage compact dans Telegram.
const formatMenuItem = (item: MenuItem): string =>
  `- ${item.title} | ${item.category}\n${item.highlight}\n${item.description}\nDisponibilite : ${item.availability}`;

// Formate un média pour un affichage compact dans Telegram.
const formatMediaItem = (item: MediaItem): string =>
  `- ${item.title} (${item.type})\n${item.description}\n${item.url}`;

// Formate un tarif pour un affichage compact dans Telegram.
const formatPricingItem = (item: PricingItem): string =>
  `- ${item.title} | ${item.price}\n${item.tag}\n${item.details}`;

// Retourne le clavier principal du bot avec accès direct aux rubriques clés.
const createMainKeyboard = () =>
  Markup.keyboard([
    ["Menu dispo", "Videos / Photos"],
    ["Tarifs", "Contact"],
    [Markup.button.webApp("Ouvrir la mini app premium", `${env.publicBaseUrl}/app`)]
  ]).resize();

// Construit le clavier inline premium affiché au démarrage.
const createInlineActions = (content: PublicContentData) =>
  Markup.inlineKeyboard([
    [Markup.button.webApp("Ouvrir la mini app", `${env.publicBaseUrl}/app`)],
    [
      Markup.button.url(content.settings.contactLabel, content.settings.contactUrl),
      Markup.button.url(content.settings.supportLabel, content.settings.supportUrl)
    ]
  ]);

// Construit un message d'accueil premium à partir du contenu public.
const buildWelcomeMessage = (content: PublicContentData): string => {
  return [
    `${content.settings.brandName}`,
    "",
    content.settings.heroTitle,
    content.settings.heroDescription,
    "",
    `Offres visibles : ${content.stats.menuCount}`,
    `Medias visibles : ${content.stats.mediaCount}`,
    `Tarifs visibles : ${content.stats.pricingCount}`,
    "",
    content.settings.announcement
  ].join("\n");
};

// Construit un texte lisible pour résumer les éléments de menu publiés.
const buildMenuMessage = async (contentStore: ContentStore): Promise<string> => {
  const content = await contentStore.getPublicContent();

  if (content.menuItems.length === 0) {
    return "Aucun element de menu n'est disponible pour le moment.";
  }

  const featuredItems = content.menuItems.filter((item) => item.isFeatured);
  const itemsToRender = featuredItems.length > 0 ? featuredItems : content.menuItems;

  return ["Menu disponible :", ...itemsToRender.map(formatMenuItem)].join("\n\n");
};

// Construit un texte lisible pour résumer les médias publiés.
const buildMediaMessage = async (contentStore: ContentStore): Promise<string> => {
  const content = await contentStore.getPublicContent();

  if (content.mediaItems.length === 0) {
    return "Aucun media n'est disponible pour le moment.";
  }

  const featuredItems = content.mediaItems.filter((item) => item.isFeatured);
  const itemsToRender = featuredItems.length > 0 ? featuredItems : content.mediaItems;

  return ["Videos / Photos :", ...itemsToRender.map(formatMediaItem)].join("\n\n");
};

// Construit un texte lisible pour résumer les tarifs publiés.
const buildPricingMessage = async (contentStore: ContentStore): Promise<string> => {
  const content = await contentStore.getPublicContent();

  if (content.pricingItems.length === 0) {
    return "Aucun tarif n'est disponible pour le moment.";
  }

  const featuredItems = content.pricingItems.filter((item) => item.isFeatured);
  const itemsToRender = featuredItems.length > 0 ? featuredItems : content.pricingItems;

  return ["Tarifs :", ...itemsToRender.map(formatPricingItem)].join("\n\n");
};

// Crée et configure l'instance du bot Telegram premium.
export const createBot = (contentStore: ContentStore): Telegraf => {
  const bot = new Telegraf(env.botToken);

  // Envoie le message d'accueil avec accès direct à la mini app premium.
  bot.start(async (context) => {
    const content = await contentStore.getPublicContent();

    await context.reply(buildWelcomeMessage(content), createMainKeyboard());
    await context.reply("Acces directs :", createInlineActions(content));
  });

  // Répond à la commande explicite qui liste le menu disponible.
  bot.command("menu", async (context) => {
    await context.reply(await buildMenuMessage(contentStore));
  });

  // Répond à la commande explicite qui liste les médias disponibles.
  bot.command("photos", async (context) => {
    await context.reply(await buildMediaMessage(contentStore));
  });

  // Répond à la commande explicite qui liste les tarifs disponibles.
  bot.command("tarifs", async (context) => {
    await context.reply(await buildPricingMessage(contentStore));
  });

  // Répond à la commande explicite qui renvoie les liens de contact.
  bot.command("contact", async (context) => {
    const content = await contentStore.getPublicContent();

    await context.reply(
      `${content.settings.contactLabel} : ${content.settings.contactUrl}\n${content.settings.supportLabel} : ${content.settings.supportUrl}`
    );
  });

  // Envoie le lien du panel uniquement aux administrateurs déclarés, avec un mini résumé dashboard.
  bot.command("admin", async (context) => {
    const userId = String(context.from?.id ?? "");

    if (!env.adminIds.includes(userId)) {
      await context.reply("Vous n'etes pas autorise a acceder au panel d'administration.");
      return;
    }

    const content = await contentStore.getAdminContent();

    await context.reply(
      [
        `Panel d'administration : ${env.publicBaseUrl}/admin/login`,
        "",
        `Menu total : ${content.stats.menuCount}`,
        `Medias total : ${content.stats.mediaCount}`,
        `Tarifs total : ${content.stats.pricingCount}`,
        `Contenus featured : ${content.stats.featuredCount}`
      ].join("\n")
    );
  });

  // Gère les boutons texte du clavier principal afin d'offrir une navigation simple.
  bot.hears("Menu dispo", async (context) => {
    await context.reply(await buildMenuMessage(contentStore));
  });

  // Gère le raccourci de consultation des médias.
  bot.hears("Videos / Photos", async (context) => {
    await context.reply(await buildMediaMessage(contentStore));
  });

  // Gère le raccourci de consultation des tarifs.
  bot.hears("Tarifs", async (context) => {
    await context.reply(await buildPricingMessage(contentStore));
  });

  // Gère le raccourci de contact.
  bot.hears("Contact", async (context) => {
    const content = await contentStore.getPublicContent();

    await context.reply(
      `${content.settings.contactLabel} : ${content.settings.contactUrl}\n${content.settings.supportLabel} : ${content.settings.supportUrl}`
    );
  });

  return bot;
};
