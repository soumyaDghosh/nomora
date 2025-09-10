import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID;

console.log(MEASUREMENT_ID);

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
    ReactGA.send({ hitType: "pageview", page: path });
};

export const normalizePath = (path: string): string => {
    if (/^\/trip\/[^/]+$/.test(path)) return "/trip/:tripId";
    if (/^\/checkout\/[^/]+$/.test(path)) return "/checkout/:tripId";
    if (/^\/transfer\/[^/]+$/.test(path)) return "/transfer/:transferId";
    if (/^\/transfer\/[^/]+\/fare$/.test(path)) return "/transfer/:transferId/fare";
    if (/^\/confirmation\/[^/]+$/.test(path)) return "/confirmation/:bookingId";
    if (/^\/hotel\/[^/]+$/.test(path)) return "/hotel/:hotelId";
    return path;
};