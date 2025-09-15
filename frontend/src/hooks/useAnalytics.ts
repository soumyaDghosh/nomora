import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { sendPageView } from "../lib/analytics";

const isValidUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const formatPath = (path: string, hotelId?: string, hotelName?: string) => {
    if (!hotelId || !hotelName) return null;

    const parts = path.split("/").filter(Boolean);
    const pathHotelId = parts[0];

    if (!isValidUUID(pathHotelId) || pathHotelId !== hotelId) return null;

    const withoutHotelId = parts.slice(1).join("/");
    return `/${hotelName}${withoutHotelId ? "/" + withoutHotelId : ""}`;
};

export default function useAnalytics() {
    const location = useLocation();
    const { hotel } = useAuthStore();

    const trackPageView = () => {
        if (!hotel?.id || !hotel?.display_name) return;

        const formattedPath = formatPath(
            location.pathname,
            hotel.id,
            hotel.display_name
        );

        if (formattedPath) {
            sendPageView(formattedPath);
        }
    };

    return { trackPageView };
}