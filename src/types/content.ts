// Décrit les valeurs possibles pour la source d'un média.
export type MediaSourceType = "url" | "upload";

// Représente un élément du menu proposé dans la mini app.
export interface MenuItem {
  id: string;
  title: string;
  description: string;
  category: string;
  availability: string;
  highlight: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Décrit les propriétés nécessaires avant la création d'un élément de menu.
export interface MenuItemInput {
  title: string;
  description: string;
  category: string;
  availability: string;
  highlight: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

// Représente un média visible dans la galerie publique.
export interface MediaItem {
  id: string;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl: string | null;
  description: string;
  sourceType: MediaSourceType;
  storagePath: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Décrit les propriétés nécessaires avant la création d'un média.
export interface MediaItemInput {
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl: string | null;
  description: string;
  sourceType: MediaSourceType;
  storagePath: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

// Représente une ligne tarifaire présentée aux utilisateurs.
export interface PricingItem {
  id: string;
  title: string;
  price: string;
  details: string;
  tag: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Décrit les propriétés nécessaires avant la création d'un tarif.
export interface PricingItemInput {
  title: string;
  price: string;
  details: string;
  tag: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

// Regroupe les paramètres d'affichage globaux de l'application.
export interface AppSettings {
  brandName: string;
  heroTitle: string;
  heroDescription: string;
  announcement: string;
  contactLabel: string;
  contactUrl: string;
  supportLabel: string;
  supportUrl: string;
}

// Regroupe tout le contenu éditable depuis le panel d'administration.
export interface ContentData {
  settings: AppSettings;
  menuItems: MenuItem[];
  mediaItems: MediaItem[];
  pricingItems: PricingItem[];
}

// Regroupe les métriques légères utilisées dans la mini app publique.
export interface PublicStats {
  menuCount: number;
  mediaCount: number;
  pricingCount: number;
  featuredCount: number;
}

// Regroupe les métriques détaillées utilisées dans le panel d'administration.
export interface DashboardStats extends PublicStats {
  publishedMenuItems: number;
  publishedMediaItems: number;
  publishedPricingItems: number;
  uploadedMediaItems: number;
}

// Décrit la réponse publique envoyée vers la mini app.
export interface PublicContentData extends ContentData {
  stats: PublicStats;
}

// Décrit la réponse complète envoyée au panel d'administration.
export interface AdminContentData extends ContentData {
  stats: DashboardStats;
}
