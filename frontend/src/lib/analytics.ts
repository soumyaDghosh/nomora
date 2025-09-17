import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID;

export const initGA = () => {
    ReactGA.initialize(MEASUREMENT_ID, { gaOptions: { send_page_view: false } });
};

// ReactGA.send({ hitType: "pageview", page: path, title });
export const sendPageView = (path: string, title?: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "pageview",
        page_path: path,
        page_title: title,
    });
};