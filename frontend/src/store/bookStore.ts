import { create } from "zustand";

export interface MyBooking {
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
  shortBookings: MyBooking[]
  setShortBookings: (data: MyBooking[]) => void
  longBookings: MyBooking[]
  setLongBookings: (updater: MyBooking[] | ((prev: MyBooking[]) => MyBooking[])) => void;
  loadingBookingId: string | null;
  setLoadingBookingId: (id: string | null) => void;
}

const useBookStore = create<BookState>((set) => ({
  shortBookings: [],
  setShortBookings: (data: MyBooking[]) => set({ shortBookings: data }),
  longBookings: [],
  setLongBookings: (updater) =>
    set((state) => ({
      longBookings:
        typeof updater === "function" ? updater(state.longBookings) : updater,
    })),
  loadingBookingId: "",
  setLoadingBookingId: (id) => set({ loadingBookingId: id }),
}));

export default useBookStore;