import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import {
    createSupplier,
    createDriver,
    createVehicle,
    updateBooking
} from "../controllers/adminControllers";

const router = Router();

router.post("/create/supplier", verifyAdmin, createSupplier);
router.post("/create/driver", verifyAdmin, createDriver);
router.post("/create/vehicle", verifyAdmin, createVehicle);

router.post("/update/booking", verifyAdmin, updateBooking);

export default router;