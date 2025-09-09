import { useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function useAuthFetch() {
    const { setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async (): Promise<boolean> => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/user`,
                { withCredentials: true }
            );

            setUser(res.data.user);
            setAuthenticated(true);

            return true;
        }
        catch {
            clearUser();
            return false;
        }
        finally {
            setAuthenticating(false);
        }
    }, [setAuthenticating, setUser, setAuthenticated, clearUser]);

    return { fetchUser };
}