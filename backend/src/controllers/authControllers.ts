import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { requestOtp, confirmOtp } from "../services/message";

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id, ...rest } = req.user!;
        res.status(200).json({ user: rest });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const { id, ...rest } = req.user!;
        res.status(200).json({ admin: rest });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body ?? {};
        if (!phone) return res.status(400).json({ message: "phone is required" });

        const requestResult = await requestOtp(`91${phone}`);
        if (requestResult.type === "error") {
            return res.status(400).json({ message: "Failed to send otp" });
        }

        return res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { phone, otp } = req.body ?? {};
        if (!phone) return res.status(400).json({ message: "phone is required" });
        if (!otp) return res.status(400).json({ message: "otp is required" });

        const confirmResult = await confirmOtp(`91${phone}`, otp);
        if (confirmResult.type === "error") {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        let result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
        let user = result.rows[0];
        let isNewUser = false;

        if (!user) {
            result = await pool.query(
                "INSERT INTO users (phone) VALUES ($1) RETURNING *",
                [phone]
            );
            user = result.rows[0];
            isNewUser = true;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "3d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production",
            sameSite: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production" ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: isNewUser ? "Signup successful" : "Login successful"
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
};