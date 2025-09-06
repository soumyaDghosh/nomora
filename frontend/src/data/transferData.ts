export type Transfer = {
    product_type: string;
    hotel: string;
    airport: string,
    baseFare: number;
    airportToll: number;
    image: string;
};

export const transferData: Record<string, Transfer> = {
    "airport-leela": {
        product_type: "airport_transfer",
        hotel: "The Leela Palace Bengaluru",
        airport: "KIA (BLR)",
        baseFare: 1080,
        airportToll: 120,
        image: "https://readdy.ai/api/search-image?query=Bangalore%20BLR%20airport%20terminal%20modern%20architecture%20glass%20building%20aviation%20infrastructure%20Indian%20airport%20departure%20arrival%20gates&width=320&height=240&seq=blr-airport-terminal&orientation=landscape"
    }
};