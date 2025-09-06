import { create } from "zustand";

export interface Booking {
  id: string;
  status: "ongoing" | "completed" | "cancelled";
  product_type: "sameday" | "city_sightseeing" | "airport_transfer" | "overnight" | "experiences";
  listing_id: string;
  price: string;
  hotel_name: string;
  trip_details: {
    hotel_id: string
    ac_type: "AC" | "Non-AC"
    car_type: "Go" | "Comfort" | "Edge" | "Max"
    date: string
    time: string
  } | null;
  transfer_details?: {
    type: "Drop to Airport" | "Pickup from Airport"
    from_location: string
    to_location: string
    terminal: "T1" | "T2"
    date: string
    time: string
    guest_count: number
  } | null;
}

interface BookState {
  bookings: Booking[]
  setBookings: (data: Booking[]) => void
}

const useBookStore = create<BookState>((set) => ({
  bookings: [],
  setBookings: (data: Booking[]) => set({ bookings: data })
}));

export default useBookStore;