import { create } from "zustand";

export interface Hotel {
  display_name: number
  address: string
  pincode: string
  lat_long: string
}

export interface User {
  phone: number
  name: string
  email: string
  avatar: string
}

interface AuthState {
  hotel: Hotel | null
  user: User | null
  isAuthenticating: boolean
  isAuthenticated: boolean

  setHotel: (hotelData: Hotel | null) => void
  setUser: (userData: User | null) => void
  setAuthenticating: (state: boolean) => void
  setAuthenticated: (state: boolean) => void
  clearUser: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  hotel: null,
  setHotel: (hotelData) => set({ hotel: hotelData }),

  user: null,
  setUser: (userData) => set({ user: userData }),

  isAuthenticating: true,
  setAuthenticating: (state) => set({ isAuthenticating: state }),

  isAuthenticated: false,
  setAuthenticated: (state) => set({ isAuthenticated: state }),

  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;