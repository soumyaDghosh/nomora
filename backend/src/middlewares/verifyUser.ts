import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

interface JwtPayload {
    id: string;
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};