import { Request, Response } from "express";
import NodeCache from "node-cache";
import { pool } from "../config/db";

const hotelCache = new NodeCache({ stdTTL: 3600 });

export const getHotel = async (req: Request, res: Response) => {
    try {
        const hotelId = req.query.hotel_id as string;

        if (!hotelId) {
            return res.status(400).json({ message: "hotel_id is required" });
        }

        let hotel = hotelCache.get<Express.Hotel>(hotelId);

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
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production",
            sameSite: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production" ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        res.cookie("hotel_name", hotel.display_name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production",
            sameSite: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat-production" ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ hotel });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};