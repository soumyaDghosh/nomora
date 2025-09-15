import { useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { sendPageView } from "../lib/analytics";

const isValidUUID = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export default function useAnalytics() {
    const location = useLocation();
    const { hotel } = useAuthStore();

    const trackPageView = () => {
        if (!hotel?.id || !hotel?.display_name) return;

        const parts = location.pathname.split("/").filter(Boolean);
        const pathHotelId = parts[0];

        if (!isValidUUID(pathHotelId) || pathHotelId !== hotel.id) return;

        sendPageView(location.pathname, hotel.display_name);
    };

    return { trackPageView };
}