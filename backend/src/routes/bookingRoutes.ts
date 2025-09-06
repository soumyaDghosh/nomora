import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { createBooking, listBookings, bookingDetails } from "../controllers/bookingControllers";

const router = Router();

router.post("/", verifyUser, createBooking);
router.get("/", verifyUser, listBookings);
router.get("/:booking_id", verifyUser, bookingDetails);

export default router;