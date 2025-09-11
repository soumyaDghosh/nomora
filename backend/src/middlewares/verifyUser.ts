import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";
import { pool } from "../config/db";

interface JwtPayload {
    id: string;
}

const hotelCache = new NodeCache({ stdTTL: 3600 });

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    try {
        const hotelId = req.params.hotelId || req.cookies?.hotel_id;

        if (!hotelId) {
            return res.status(400).json({ message: "hotel_id is required" });
        }

        let hotel = hotelCache.get(hotelId) as Express.Hotel | undefined;

        if (!hotel) {
            const query = `
                SELECT id, display_name, address, pincode, lat_long
                FROM hotels
                WHERE id = $1
                LIMIT 1;
            `;
            const { rows } = await pool.query(query, [hotelId]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            hotel = rows[0] as Express.Hotel;
            hotelCache.set(hotelId, hotel);
        }

        res.cookie("hotel_id", hotelId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        if (!token) {
            return res.status(200).json({ hotel, user: null });
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        }
        catch {
            return res.status(200).json({ hotel, user: null });
        }

        const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(200).json({ hotel, user: null });
        }

        req.user = user;
        req.hotel = hotel;
        next();
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};