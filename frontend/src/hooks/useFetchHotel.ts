import { useCallback } from "react";
import axios from "axios";
import useCreateManifest from "./useCreateManifest";
import useAuthStore from "../store/authStore";

export default function useFetchHotel() {
    const { createManifest } = useCreateManifest();
    const { setHotel, setFetchingHotel } = useAuthStore();

    const fetchHotel = useCallback(async () => {
        try {
            const hotelId = window.location.pathname.split("/")[1];

            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/hotel?hotel_id=${hotelId}`, {
                withCredentials: true,
            });

            if (res.data?.hotel) {
                setHotel(res.data.hotel);
                createManifest(res.data.hotel);
            }
        }
        finally {
            setFetchingHotel(false);
        }
    }, [setHotel, createManifest, setFetchingHotel]);

    return { fetchHotel };
}