import { useEffect } from "react"
import { useLocation, Routes, Route, Outlet } from "react-router-dom"
import { normalizePath, trackPageView } from "./lib/analytics";
import useAuthFetch from "./hooks/useAuthFetch"
import useFetchBookings from "./hooks/useFetchBookings"
import ProtectedRoute from "./pages/ProtectedRoute"
import Home from "./pages/Home"
import Welcome from "./pages/Welcome"
import Auth from "./pages/Auth"
import Explore from "./pages/Explore"
import Trip from "./pages/Trip"
import Checkout from "./pages/Checkout"
import Transfer from "./pages/Transfer"
import TransferFare from "./pages/TransferFare"
import Confirmation from "./pages/Confirmation"
import Support from "./pages/Support"
import Bookings from "./pages/Bookings"
import Profile from "./pages/Profile"
import { HotelNotFound, NotFound } from "./pages/NotFound"
import BottomNavigation from "./components/BottomNavigation"

function App() {
  const location = useLocation();

  const { fetchUser } = useAuthFetch();
  const { fetchBookings } = useFetchBookings();

  useEffect(() => {
    const normalizedPath = normalizePath(location.pathname);
    trackPageView(normalizedPath);
  }, [location.pathname]);

  useEffect(() => {
    const init = async () => {
      const ok = await fetchUser();

      if (ok) {
        await fetchBookings();
      }
    };

    init();
  }, [fetchUser, fetchBookings]);

  return (
    <Routes>
      <Route path="/" element={<HotelNotFound />} />

      <Route path=":hotelId" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="auth" element={<Auth />} />
          <Route path="explore" element={<Explore />} />
          <Route path="trip/:tripId" element={<Trip />} />
          <Route path="checkout/:tripId" element={<Checkout />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="transfer/fare" element={<TransferFare />} />
          <Route path="confirmation/:bookingId" element={<Confirmation />} />
          <Route path="support" element={<Support />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const AppLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  )
}

export default App