import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { getUser, sendOTP, verifyOTP, logoutUser } from "../controllers/authControllers";

const router = Router();

router.post("/otp/send", sendOTP);
router.post("/otp/verify", verifyOTP);
router.get("/user", verifyUser, getUser);
router.get("/logout", verifyUser, logoutUser);

export default router;