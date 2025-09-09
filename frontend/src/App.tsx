import { useRef, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import useAuthFetch from "./hooks/useAuthFetch"
import useFetchBookings from "./hooks/useFetchBookings"
import useFetchBooking from "./hooks/useFetchBooking"
import useAuthStore from "./store/authStore"
import useBookStore from "./store/bookStore"
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
import NotFound from "./pages/NotFound"
import BottomNavigation from "./components/BottomNavigation"

function App() {
  const { fetchUser } = useAuthFetch();
  const { fetchBookings } = useFetchBookings();
  const { fetchBooking } = useFetchBooking();

  const { isAuthenticated } = useAuthStore();
  const { shortBookings, longBookings } = useBookStore();
  const fetchingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      const ok = await fetchUser();

      if (ok) {
        await fetchBookings();
      }
    };

    init();
  }, [fetchUser, fetchBookings, fetchBooking]);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated || !shortBookings.length) return;

      const bookingsToFetch = shortBookings.filter(
        (b) =>
          !longBookings.some((lb) => lb.id === b.id) &&
          !fetchingRef.current.has(b.id)
      );

      if (bookingsToFetch.length) {
        bookingsToFetch.forEach((b) => fetchingRef.current.add(b.id));
        await Promise.all(bookingsToFetch.map((b) => fetchBooking(b.id)));
        bookingsToFetch.forEach((b) => fetchingRef.current.delete(b.id));
      }
    };

    init();
  }, [isAuthenticated, shortBookings, longBookings, fetchBooking]);

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trip/:tripId" element={<Trip />} />
          <Route path="/checkout/:tripId" element={<Checkout />} />
          <Route path="/transfer/:transferId" element={<Transfer />} />
          <Route path="/transfer/:transferId/fare" element={<TransferFare />} />
          <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          <Route path="/support" element={<Support />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation />
    </>
  )
}

export default App