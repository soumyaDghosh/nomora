import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import createBooking from "../controllers/bookingControllers/create";
import verifyBooking from "../controllers/bookingControllers/verify";
import { listBookings, bookingDetails } from "../controllers/bookingControllers/others";

const router = Router();

router.post("/create", verifyUser, createBooking);
router.post("/verify", verifyUser, verifyBooking);
router.get("/list", verifyUser, listBookings);
router.get("/details", verifyUser, bookingDetails);

export default router;