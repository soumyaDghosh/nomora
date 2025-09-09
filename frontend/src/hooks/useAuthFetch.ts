import { useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function useAuthFetch() {
    const { setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async (): Promise<boolean> => {
        try {
            setAuthenticating(true);

            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/user`,
                { withCredentials: true }
            );

            setUser(res.data.user);
            setAuthenticated(true);
            localStorage.setItem("hasDoneAuth", "true");

            return true;
        }
        catch {
            clearUser();
            localStorage.removeItem("hasDoneAuth");

            return false;
        }
        finally {
            setAuthenticating(false);
        }
    }, [setAuthenticating, setUser, setAuthenticated, clearUser]);

    return { fetchUser };
}