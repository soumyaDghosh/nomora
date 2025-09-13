import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID;

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
    ReactGA.send({ hitType: "pageview", page: path });
};