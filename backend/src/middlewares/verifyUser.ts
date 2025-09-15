import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { pool } from "../config/db";

interface JwtPayload {
    id: string;
}

const userCache = new NodeCache({ stdTTL: 3600 });

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(404).json({ message: "No token found" });
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        }
        catch {
            return res.status(404).json({ message: "Invalid token" });
        }

        const userId = decoded.id;
        let user = userCache.get<Express.User>(userId);

        if (!user) {
            const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            user = result.rows[0];
            userCache.set(userId, user);
        }

        req.user = user;
        next();
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};