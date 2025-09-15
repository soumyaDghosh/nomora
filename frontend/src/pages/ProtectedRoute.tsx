import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { HotelNotFound } from "./NotFound";

export default function ProtectedRoute() {
    const location = useLocation();
    const { hotelId } = useParams<{ hotelId: string }>();

    const { hotel, isFetchingHotel } = useAuthStore();

    const doneWelcome = localStorage.getItem("doneWelcome");
    const doneAuth = localStorage.getItem("doneAuth");
    const authPages = ["/auth", "/welcome"];

    const isAuthPage = authPages.some((path) =>
        location.pathname.includes(path)
    );

    // Validate hotelId format (UUID check)
    const isValidHotelId =
        hotelId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(hotelId);

    if (!isValidHotelId) {
        return <HotelNotFound />;
    }

    // If hotel not found
    if (!isFetchingHotel && !hotel) {
        return <Navigate to="/" replace />
    }

    if (doneAuth) {
        // Visiting /auth or /welcome - redirect back or to "/"
        if (isAuthPage) {
            let redirectTo = location.state?.from?.pathname;
            if (redirectTo === `/${hotelId}/profile`) {
                redirectTo = `/${hotelId}`;
            }
            return <Navigate to={redirectTo || `/${hotelId}`} replace />;
        }
    }
    else {
        // Prevent /welcome after seen
        if (location.pathname.endsWith("/welcome") && doneWelcome) {
            return <Navigate to={`/${hotelId}/auth`} replace />;
        }

        // NOT on authPages - save intended route
        if (!isAuthPage) {
            if (!doneWelcome) {
                return <Navigate to={`/${hotelId}/welcome`} replace state={{ from: location }} />;
            }
            return <Navigate to={`/${hotelId}/auth`} replace state={{ from: location }} />;
        }
    }

    return <Outlet />;
}