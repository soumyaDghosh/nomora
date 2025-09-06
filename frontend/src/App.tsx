import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import useAuthFetch from "./hooks/useAuthFetch"
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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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