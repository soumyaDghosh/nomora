export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface GalleryImage {
    url: string;
    label: string;
    significance?: string;
    description?: string;
    dontMiss?: string;
}

export interface ImageData {
    url: string;
    label: string;
    category?: string;
    timings?: string;
    duration?: string;
    entryType?: string;
    entryFee?: string;
    gallery?: GalleryImage[];
}