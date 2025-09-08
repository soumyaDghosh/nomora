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