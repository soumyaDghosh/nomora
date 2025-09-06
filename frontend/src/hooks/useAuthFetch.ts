import { useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function useAuthFetch() {
    const { setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async () => {
        try {
            setAuthenticating(true);

            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/user`,
                { withCredentials: true }
            );

            setUser(res.data.user);
            setAuthenticated(true);
        }
        catch {
            clearUser();
        }
        finally {
            setAuthenticating(false);
        }
    }, [setAuthenticating, setUser, setAuthenticated, clearUser]);

    return { fetchUser };
}