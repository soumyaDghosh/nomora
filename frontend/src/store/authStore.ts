import { create } from "zustand";

export interface User {
  phone: number
  name: string
  email: string
  avatar: string
}

interface AuthState {
  user: User | null
  isAuthenticating: boolean
  isAuthenticated: boolean

  setUser: (userData: User | null) => void
  setAuthenticating: (state: boolean) => void
  setAuthenticated: (state: boolean) => void
  clearUser: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: false,
  isAuthenticated: false,

  setUser: (userData) => set({ user: userData }),
  setAuthenticating: (state) => set({ isAuthenticating: state }),
  setAuthenticated: (state) => set({ isAuthenticated: state }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;