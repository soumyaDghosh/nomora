import { useLocation, Navigate, Outlet, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { HotelNotFound } from "./NotFound";
import AppLoader from "../components/AppLoader";

export default function ProtectedRoute() {
    const location = useLocation();
    const { hotelId } = useParams<{ hotelId: string }>();

    const {
        hotel,
        isAuthenticated,
        isAuthenticating
    } = useAuthStore();

    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    const authPages = ["/auth", "/welcome"];

    // Validate hotelId format (UUID check)
    const isValidHotelId =
        hotelId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(hotelId);

    if (!isValidHotelId) {
        return <HotelNotFound />;
    }

    const isAuthPage = authPages.some((path) =>
        location.pathname.includes(path)
    );

    if (isAuthenticating) {
        return <AppLoader />
    }

    // Prevent /welcome after seen
    if (!isAuthenticated && location.pathname.endsWith("/welcome") && hasSeenWelcome) {
        return <Navigate to={`/${hotelId}/auth`} replace />;
    }

    // If authenticated and visiting /auth or /welcome - redirect back or to "/"
    if (isAuthenticated && isAuthPage) {
        let redirectTo = location.state?.from?.pathname;
        if (redirectTo === `/${hotelId}/profile`) {
            redirectTo = `/${hotelId}`;
        }
        return <Navigate to={redirectTo || `/${hotelId}`} replace />;
    }

    // If hotel not found
    if (!isAuthenticating && !isAuthenticated && !hotel) {
        return <Navigate to="/" replace />
    }

    // If NOT authenticated and NOT on authPages - save intended route
    if (!isAuthenticating && !isAuthenticated && !isAuthPage) {
        if (!hasSeenWelcome) {
            return <Navigate to={`/${hotelId}/welcome`} replace state={{ from: location }} />;
        }
        return <Navigate to={`/${hotelId}/auth`} replace state={{ from: location }} />;
    }

    // If NOT authenticated and on authPages
    if (!isAuthenticated && isAuthPage) {
        return <Outlet />;
    }

    return <Outlet />;
}