import { Router } from "express";
import { getHotel } from "../controllers/hotelControllers";

const router = Router();

router.get("/", getHotel);

export default router;