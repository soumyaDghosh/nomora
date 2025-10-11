import { BangaloreSightseeing } from "./itineraries/BangaloreSightseeing";
import { MysuruSightseeing } from "./itineraries/MysuruSightSeeing";

type Tag = {
    text: string;
    color: "orange" | "red" | "green" | "blue" | "purple";
};

type GalleryImage = {
    url: string;
    label: string;
};

type LandmarkImage = {
    url: string;
    label: string;
    category: string;
    timings: string;
    duration: string;
    entryType: string;
    entryFee: string;
    significance: string;
    description: string;
    dontMiss: string[];
    gallery: GalleryImage[];
};

type ItineraryStop = {
    time: string;
    title: string;
    description: string;
    duration: string;
    number?: string;
};

export type CarType = {
    id: string;
    name: string;
    seats: string;
    description: string;
    acPrice: number;
    nonAcPrice: number;
    image: string
};

export type TimeSlot = {
    time: string;
    available: boolean;
    period: "AM" | "PM";
};

export type Supplier = {
    id: string,
    display_name: string,
    legal_name: string,
    address: string,
    phone_number: string
};

export type Hotel = {
    id: string,
    name: string
};

export type Trip = {
    supplier: Supplier,
    hotel: Hotel,
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    taxRate: number,
    duration: string;
    product_type: "sameday" | "city_sightseeing" | "airport_transfer" | "overnight" | "experiences";
    tags: Tag[];
    images: LandmarkImage[];
    itinerary: ItineraryStop[];
    carTypes: CarType[];
    timeSlots: TimeSlot[];
};

export const tripData: Record<string, Trip> = {
    "heritage-tour-8hr" : BangaloreSightseeing,
    "mysore-palace" : MysuruSightseeing,
};