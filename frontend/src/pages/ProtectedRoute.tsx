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

    const params = new URLSearchParams(location.search);
    const isDeeplink = params.get("type") === "deeplink";

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
            return (
                <Navigate
                    to={{
                        pathname: redirectTo || `/${hotelId}`,
                        search: location.state?.from?.search || location.search,
                    }}
                    replace
                />
            );
        }
    }
    else {
        // Deeplink - skip /welcome
        if (isDeeplink && !isAuthPage) {
            return (
                <Navigate
                    to={{
                        pathname: `/${hotelId}/auth`,
                        search: location.search,
                    }}
                    replace
                    state={{ from: location }}
                />
            );
        }

        // Prevent /welcome after seen
        if (location.pathname.endsWith("/welcome") && doneWelcome) {
            return (
                <Navigate
                    to={{
                        pathname: `/${hotelId}/auth`,
                        search: location.search
                    }}
                    replace
                />
            );
        }

        // NOT on authPages - save intended route
        if (!isAuthPage) {
            if (!doneWelcome) {
                return (
                    <Navigate
                        to={{
                            pathname: `/${hotelId}/welcome`,
                            search: location.search,
                        }}
                        replace
                        state={{ from: location }}
                    />
                );
            }
            return (
                <Navigate
                    to={{
                        pathname: `/${hotelId}/auth`,
                        search: location.search
                    }}
                    replace
                    state={{ from: location }}
                />
            );
        }
    }

    return <Outlet />;
}