import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { pool } from "../config/db";
import sendMail from "../services/mailer";

const ALLOWED_PRODUCT_TYPES = [
    "sameday",
    "city_sightseeing",
    "airport_transfer",
    "overnight",
    "experiences",
] as const;
const COMING_SOON_PRODUCT_TYPES = new Set<typeof ALLOWED_PRODUCT_TYPES[number]>([
    "overnight",
    "experiences",
]);
const TRANSFER_TYPES = ["Drop to Airport", "Pickup from Airport"] as const;
const MIN_GUEST_COUNT = 1;
const MAX_GUEST_COUNT = 4;

const validateFields = (obj: any, keys: string[]) => {
    for (const key of keys) {
        if (!obj || obj[key] === undefined || obj[key] === null) {
            return key;
        }
    }
    return null;
};

const validateDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const validateTime = (time: string) => /^(0?[1-9]|1[0-2])(:[0-5][0-9])? (AM|PM)$/.test(time);

const validateTripDetails = (trip_details: any) => {
    const missing = validateFields(trip_details, [
        "hotel_id",
        "ac_type",
        "car_type",
        "date",
        "time",
    ]);
    if (missing) return `trip_details.${missing} is required`;

    if (!["AC", "Non-AC"].includes(trip_details.ac_type))
        return "trip_details.ac_type must be either 'AC' or 'Non-AC'";

    if (!["Go", "Comfort", "Edge", "Max"].includes(trip_details.car_type))
        return "trip_details.car_type must be one of: Go, Comfort, Edge, Max";

    if (!validateDate(trip_details.date))
        return "trip_details.date must be in format YYYY-MM-DD";

    if (!validateTime(trip_details.time))
        return "trip_details.time must be in format h:mm AM/PM";

    return null;
};

const validateTransferDetails = (transfer_details: any) => {
    const missing = validateFields(transfer_details, [
        "type",
        "from_location",
        "to_location",
        "terminal",
        "date",
        "time",
        "guest_count",
    ]);
    if (missing) return `transfer_details.${missing} is required`;

    if (!TRANSFER_TYPES.includes(transfer_details.type)) {
        return `transfer_details.type must be one of: ${TRANSFER_TYPES.join(", ")}`;
    }

    const fromLoc = typeof transfer_details.from_location === "string" ? transfer_details.from_location.trim() : "";
    if (!fromLoc) return "transfer_details.from_location is required";

    const toLoc = typeof transfer_details.to_location === "string" ? transfer_details.to_location.trim() : "";
    if (!toLoc) return "transfer_details.to_location is required";

    const terminal = typeof transfer_details.terminal === "string" ? transfer_details.terminal.trim() : "";
    if (!terminal) return "transfer_details.terminal is required";

    if (!validateDate(transfer_details.date)) return "transfer_details.date must be in format YYYY-MM-DD";
    if (!validateTime(transfer_details.time)) return "transfer_details.time must be in format h:mm AM/PM";

    const guestCount = Number(transfer_details.guest_count);
    if (!Number.isInteger(guestCount) || guestCount < MIN_GUEST_COUNT || guestCount > MAX_GUEST_COUNT) {
        return `transfer_details.guest_count must be an integer between ${MIN_GUEST_COUNT} and ${MAX_GUEST_COUNT}`;
    }

    return null;
};

function validateTripWindow(date: string, time: string): string | null {
    try {
        const bookingDateTime = parseDateTime(date, time);
        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const bookingStart = new Date(bookingDateTime.getFullYear(), bookingDateTime.getMonth(), bookingDateTime.getDate());

        const daysDiff = Math.floor((bookingStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0 || daysDiff > 7) {
            return "Trip can only be booked within 7 days from today";
        }

        const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 8) {
            return "Trip must be booked at least 8 hours in advance";
        }

        return null;
    }
    catch (err) {
        return "Invalid trip date/time";
    }
}

function parseDateTime(date: string, time: string): Date {
    let normalized = time.trim().toUpperCase();
    if (!normalized.includes(":")) {
        normalized = normalized.replace(/ (AM|PM)$/, ":00 $1");
    }

    const [year, month, day] = date.split("-").map(Number);

    const match = normalized.match(/^(\d{1,2})(?::(\d{2}))? (AM|PM)$/);
    if (!match) {
        throw new Error(`Invalid time format after normalization: ${normalized}`);
    }

    let hour = Number(match[1]);
    const minute = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3];

    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    try {
        return new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }
    catch {
        return dateStr;
    }
};

function formatKeyValue(obj: Record<string, any>): string {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (key === "date" && typeof value === "string") {
                return `${capitalize(key)}: ${formatDate(value)}`;
            }
            return `${capitalize(key)}: ${value}`;
        })
        .join("\n");
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export const createBooking = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const { product_type, trip_details, transfer_details, listing_id, price } = req.body ?? {};

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        else if (!product_type) return res.status(400).json({ message: "product_type is required" });
        else if (!ALLOWED_PRODUCT_TYPES.includes(product_type))
            return res.status(400).json({
                message: `product_type must be one of: ${ALLOWED_PRODUCT_TYPES.join(", ")}`,
            });

        else if (COMING_SOON_PRODUCT_TYPES.has(product_type)) {
            return res.status(503).json({
                message: `${product_type} bookings are coming soon`,
            });
        }
        else if (!listing_id) return res.status(400).json({ message: "listing_id is required" });
        else if (price === undefined) return res.status(400).json({ message: "price is required" });
        else if (["sameday", "city_sightseeing"].includes(product_type)) {
            const errorMsg = validateTripDetails(trip_details);
            if (errorMsg) return res.status(400).json({ message: errorMsg });

            const windowError = validateTripWindow(trip_details.date, trip_details.time);
            if (windowError) return res.status(400).json({ message: windowError });
        }
        else if (product_type === "airport_transfer") {
            const errorMsg = validateTransferDetails(transfer_details);
            if (errorMsg) return res.status(400).json({ message: errorMsg });

            const bookingDateTime = parseDateTime(transfer_details.date, transfer_details.time);
            const now = new Date();
            const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

            if (bookingDateTime < fourHoursLater) {
                return res.status(400).json({
                    message: "Airport transfer must be booked at least 4 hours in advance",
                });
            }
        }

        await client.query("BEGIN");

        const dupCheck = await client.query(
            `SELECT 1 
             FROM bookings 
             WHERE user_id = $1 AND listing_id = $2 AND status = 'ongoing'
             LIMIT 1`,
            [user_id, listing_id]
        );

        if (dupCheck.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                message: `You already have an ongoing ${product_type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} booking`,
            });
        }

        const insertResult = await client.query(
            `
  INSERT INTO bookings (
    user_id, status, product_type, trip_details, transfer_details,
    price, listing_id, supplier_id, driver_id, vehicle_id
  )
  VALUES (
    $1,
    'ongoing',
    $2,
    CASE WHEN $3::jsonb IS NOT NULL THEN 
      (ROW(
        ($3->>'hotel_id')::uuid,
        $3->>'ac_type',
        $3->>'car_type',
        $3->>'date',
        $3->>'time'
      )::trip_detail)
    ELSE NULL END,
    CASE WHEN $4::jsonb IS NOT NULL THEN 
      (ROW(
        $4->>'type',
        $4->>'from_location',
        $4->>'to_location',
        $4->>'terminal',
        $4->>'date',
        $4->>'time',
        ($4->>'guest_count')::int
      )::transfer_detail)
    ELSE NULL END,
    $5, -- price
    $6, -- listing_id
    NULL, NULL, NULL
  )
  RETURNING id
  `,
            [
                user_id,
                product_type,
                trip_details ? JSON.stringify(trip_details) : null,
                transfer_details ? JSON.stringify(transfer_details) : null,
                price,
                listing_id
            ]
        );

        const newBookingId = insertResult.rows[0].id;

        let hotel_name: string | null = null;
        if (trip_details?.hotel_id) {
            const hotelResult = await client.query(
                `SELECT name FROM hotels WHERE id = $1 LIMIT 1`,
                [trip_details.hotel_id]
            );
            hotel_name = hotelResult.rows[0]?.name ?? null;
        }

        const booking = {
            id: newBookingId,
            status: "ongoing",
            product_type,
            listing_id,
            price,
            trip_details: product_type === "airport_transfer" ? null : trip_details,
            transfer_details: product_type === "airport_transfer" ? transfer_details : null,
            hotel_name,
        };

        sendMail({
            from: `${process.env.EMAIL_USER} <${process.env.EMAIL_ADDRESS}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "New Booking",
            text: `
User ID: ${req.user?.id}
User Phone: ${req.user?.phone}
Booking ID: ${newBookingId}
Product Type: ${product_type}
Listing ID: ${listing_id}
${trip_details?.hotel_id ? `Hotel: ${hotel_name}` : ""}
Price: ₹${price}

${product_type === "airport_transfer"
                    ? `Transfer Details:\n${formatKeyValue(transfer_details)}`
                    : `Trip Details:\n${formatKeyValue(trip_details)}`}
`,
        }).catch(err => console.error("Failed to send booking mail:", err));

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Booked successfully",
            booking,
        });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            console.error("Postgres error:", error.message);
            if (error.detail) console.error(error.detail);
            return res.status(500).json({ message: "Database error" });
        }
        else {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const listBookings = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized: user_id missing" });
        }

        const result = await client.query(
            `
            SELECT 
                b.id,
                b.status,
                b.product_type,
                b.listing_id,
                b.price,
                to_jsonb(b.trip_details) AS trip_details,
                to_jsonb(b.transfer_details) AS transfer_details,
                h.name AS hotel_name
            FROM bookings b
            LEFT JOIN hotels h ON (b.trip_details).hotel_id = h.id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
            `,
            [user_id]
        );

        return res.status(200).json({ bookings: result.rows });
    }
    catch (error) {
        if (error instanceof DatabaseError) {
            console.error("Postgres error:", error.message);
            return res.status(500).json({ message: "Database error" });
        }
        else {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const bookingDetails = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const { booking_id } = req.params;

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        else if (!booking_id) return res.status(400).json({ message: "booking_id is required" });

        const result = await client.query(
            `
      SELECT 
        b.id,
        b.user_id,
        b.status,
        b.product_type,
        row_to_json(b.trip_details) AS trip_details,
        row_to_json(b.transfer_details) AS transfer_details,
        b.price,
        b.listing_id,
        b.driver_id,
        b.vehicle_id,
        d.name AS driver_name,
        d.phone_number AS driver_phone_number,
        v.car_type AS vehicle_car_type,
        v.ac_type AS vehicle_ac_type,
        v.car_number AS vehicle_car_number
      FROM bookings b
      LEFT JOIN drivers d ON b.driver_id = d.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = $1
      LIMIT 1
      `,
            [booking_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const row = result.rows[0];

        if (row.user_id !== user_id) {
            return res.status(403).json({ message: "Forbidden: booking does not belong to user" });
        }

        return res.status(200).json({
            booking: {
                id: row.id,
                status: row.status,
                product_type: row.product_type,
                ...(row.product_type === "sameday" || row.product_type === "city_sightseeing"
                    ? { trip_details: row.trip_details }
                    : {}),
                ...(row.product_type === "airport_transfer"
                    ? { transfer_details: row.transfer_details }
                    : {}),
                price: row.price,
                listing_id: row.listing_id,
                driver: row.driver_id
                    ? {
                        name: row.driver_name,
                        phone_number: row.driver_phone_number,
                    }
                    : null,
                vehicle: row.vehicle_id
                    ? {
                        car_type: row.vehicle_car_type,
                        ac_type: row.vehicle_ac_type,
                        car_number: row.vehicle_car_number,
                    }
                    : null
            },
        });
    }
    catch (error) {
        if (error instanceof DatabaseError) {
            console.error("Postgres error:", error.message);
            return res.status(500).json({ message: "Database error" });
        }
        else {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};