import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AppLoader from "../components/Loader/AppLoader";

export default function ProtectedRoute() {
    const location = useLocation();
    const { isAuthenticated, isAuthenticating } = useAuthStore();

    if (isAuthenticating) {
        return <AppLoader />;
    }

    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    const authPages = ["/auth", "/welcome"];
    const isAuthPage = authPages.some((path) =>
        location.pathname.startsWith(path)
    );

    // Prevent /welcome after seen
    if (!isAuthenticated && location.pathname === "/welcome" && hasSeenWelcome) {
        return <Navigate to="/auth" replace />;
    }

    // If authenticated and visiting /auth or /welcome - redirect back or to "/"
    if (isAuthenticated && isAuthPage) {
        let redirectTo = location.state?.from?.pathname;

        // prevent redirecting back to /profile after login
        if (redirectTo === "/profile") {
            redirectTo = "/";
        }

        return <Navigate to={redirectTo || "/"} replace />;
    }

    // If NOT authenticated and NOT on authPages - save intended route
    if (!isAuthenticated && !isAuthPage) {
        if (!hasSeenWelcome) {
            return (
                <Navigate
                    to="/welcome"
                    replace
                    state={{ from: location }}
                />
            );
        }
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    // If NOT authenticated and on authPages
    if (!isAuthenticated && isAuthPage) {
        return <Outlet />;
    }

    return <Outlet />;
}
