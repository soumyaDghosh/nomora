import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
    createSupplier,
    createDriver,
    createVehicle,
    updateBooking,
    createHotel,
    whatsappMessage
} from "../controllers/adminControllers";

const router = Router();

router.post("/create/supplier", verifyAdmin, createSupplier);
router.post("/create/driver", verifyAdmin, createDriver);
router.post("/create/vehicle", verifyAdmin, createVehicle);

router.post("/update/booking", verifyAdmin, updateBooking);

router.post("/create/hotel", verifyAdmin, createHotel);

router.post("/send/message", verifyAdmin, whatsappMessage);

export default router;