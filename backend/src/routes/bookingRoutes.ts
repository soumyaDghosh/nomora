import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { createBooking, verifyBooking, listBookings, bookingDetails } from "../controllers/bookingControllers";

const router = Router();

router.post("/create", verifyUser, createBooking);
router.post("/verify", verifyUser, verifyBooking);
router.get("/list", verifyUser, listBookings);
router.get("/details", verifyUser, bookingDetails);

export default router;