import { useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function useFetchUser() {
    const { setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async (): Promise<boolean> => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/user`, {
                withCredentials: true,
            });

            if (res.data?.user) {
                localStorage.setItem("doneAuth", "true");
                setUser(res.data.user);
                setAuthenticated(true);
                return true;
            }
            else {
                localStorage.removeItem("doneAuth");
                clearUser();
                return false;
            }
        }
        catch {
            clearUser();
            return false;
        }
        finally {
            setAuthenticating(false);
        }
    }, [setUser, setAuthenticated, clearUser, setAuthenticating]);

    return { fetchUser };
}