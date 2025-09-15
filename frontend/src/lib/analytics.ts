import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID;

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID, { gaOptions: { send_page_view: false } });
};

export const sendPageView = (path: string, title?: string) => {
    ReactGA.send({ hitType: "pageview", page: path, title });
};