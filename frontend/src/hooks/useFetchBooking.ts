import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import type { Booking } from "../store/bookStore";
import { tripData, type Trip } from "../data/tripData";
import { transferData, type Transfer } from "../data/transferData";

export default function useFetchBooking() {
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isAirportTransfer, setAirportTransfer] = useState(false);
    const [trip, setTrip] = useState<Trip | null>(null);
    const [transfer, setTransfer] = useState<Transfer | null>(null);

    const fetchBooking = useCallback(async (bookingId?: string) => {
        if (!bookingId) return;

        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/book/${bookingId}`,
                { withCredentials: true }
            );
            const booking = response.data.booking;

            setBooking(booking);
            setAirportTransfer(booking.product_type === "airport_transfer");

            if (booking.product_type === "airport_transfer") {
                setTransfer(transferData[response.data.booking.listing_id ?? ""])
            }
            else {
                setTrip(tripData[response.data.booking.listing_id ?? ""])
            }
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.log(error.response?.data?.message || "Failed to fetch booking");
        }
        finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        booking,
        isAirportTransfer,
        trip,
        transfer,
        fetchBooking
    };
}