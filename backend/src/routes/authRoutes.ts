import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { getUser, getAdmin, sendOTP, verifyOTP, logoutUser } from "../controllers/authControllers";

const router = Router();

router.post("/otp/send", sendOTP);
router.post("/otp/verify", verifyOTP);
router.get("/user/:hotelId", verifyUser, getUser);
router.get("/admin", verifyAdmin, getAdmin);
router.get("/logout", verifyUser, logoutUser);

export default router;