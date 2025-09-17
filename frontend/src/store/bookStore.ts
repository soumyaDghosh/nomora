import { create } from "zustand";

export interface MyBooking {
  id: string;
  status: "ongoing" | "completed" | "cancelled";
  product_type: "sameday" | "city_sightseeing" | "airport_transfer" | "overnight" | "experiences";
  listing_id?: string;
  ac_type: "AC" | "Non-AC"
  car_type: "Go" | "Comfort" | "Edge" | "Max"
  transfer_type?: "Drop to Airport" | "Pickup from Airport"
  terminal?: string
  guest_count?: number
  price: string;
  paid_amount: string;
  payment_status: "paid" | "unpaid" | "advance-paid" | "refunded"
  date: string
  time: string
}

interface BookState {
  shortBookings: MyBooking[]
  setShortBookings: (data: MyBooking[]) => void
  loadingBookings: boolean;
  setLoadingBookings: (state: boolean) => void;

  longBookings: MyBooking[]
  setLongBookings: (updater: MyBooking[] | ((prev: MyBooking[]) => MyBooking[])) => void;
}

const useBookStore = create<BookState>((set) => ({
  shortBookings: [],
  setShortBookings: (data: MyBooking[]) => set({ shortBookings: data }),
  loadingBookings: true,
  setLoadingBookings: (state: boolean) => set({ loadingBookings: state }),

  longBookings: [],
  setLongBookings: (updater) =>
    set((state) => ({
      longBookings:
        typeof updater === "function" ? updater(state.longBookings) : updater,
    }))
}));

export default useBookStore;