import type { ContentData } from "../types/content";

// Définit le contenu initial chargé lors du premier démarrage du projet.
export const defaultContent: ContentData = {
  settings: {
    brandName: "Votre Studio Premium",
    heroTitle: "Une mini app Telegram qui vend vraiment",
    heroDescription:
      "Consultez le menu disponible, les videos / photos et les tarifs directement depuis Telegram.",
    announcement: "Nouvelle collection premium disponible cette semaine.",
    contactLabel: "Contacter sur Telegram",
    contactUrl: "https://t.me/yourusername",
    supportLabel: "Demander une offre sur mesure",
    supportUrl: "https://t.me/yourusername?text=Bonjour%20je%20veux%20une%20offre%20premium"
  },
  menuItems: [
    {
      id: "menu-1",
      title: "Pack Signature",
      description: "Une offre premium ideale pour mettre en avant votre proposition principale.",
      category: "Offres",
      availability: "Disponible aujourd'hui",
      highlight: "Best seller",
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    },
    {
      id: "menu-2",
      title: "Pack Experience",
      description: "Une formule complete avec accompagnement prioritaire et options avancees.",
      category: "Offres",
      availability: "Sur reservation",
      highlight: "Edition limitee",
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    }
  ],
  mediaItems: [
    {
      id: "media-1",
      title: "Campagne photo premium",
      type: "photo",
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      description: "Exemple de visuel hero pour presenter votre activite.",
      sourceType: "url",
      storagePath: null,
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    },
    {
      id: "media-2",
      title: "Presentation video premium",
      type: "video",
      url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
      description: "Exemple de video courte visible dans la mini app.",
      sourceType: "url",
      storagePath: null,
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    }
  ],
  pricingItems: [
    {
      id: "pricing-1",
      title: "Formule Select",
      price: "89 EUR",
      details: "Acces a l'offre principale avec mise en avant prioritaire.",
      tag: "Le plus choisi",
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    },
    {
      id: "pricing-2",
      title: "Formule Elite",
      price: "149 EUR",
      details: "Acces complet, suivi prioritaire et options avancees.",
      tag: "Accompagnement complet",
      isFeatured: true,
      isPublished: true,
      sortOrder: 2,
      createdAt: "2026-01-01T09:00:00.000Z",
      updatedAt: "2026-01-01T09:00:00.000Z"
    }
  ]
};
