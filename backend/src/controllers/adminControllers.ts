import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { pool } from "../config/db";
import { sendWhatsAppMessage } from "../services/message";

export const createSupplier = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { display_name, legal_name, address, phone_number } = req.body ?? {};

        if (!display_name) {
            return res.status(400).json({ message: "display_name is required" });
        } else if (!legal_name) {
            return res.status(400).json({ message: "legal_name is required" });
        } else if (!address) {
            return res.status(400).json({ message: "address is required" });
        } else if (!phone_number) {
            return res.status(400).json({ message: "phone_number is required" });
        }

        await client.query("BEGIN");

        const dupCheck = await client.query(
            "SELECT id FROM suppliers WHERE phone_number = $1",
            [phone_number]
        );

        if (dupCheck.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({ message: "Supplier with this phone number already exists" });
        }

        await client.query(
            `
            INSERT INTO suppliers (display_name, legal_name, address, phone_number)
            VALUES ($1, $2, $3, $4);
            `
            ,
            [display_name, legal_name, address, phone_number]
        );

        await client.query("COMMIT");

        return res.status(201).json({ message: "Supplier created successfully" });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        } else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const createDriver = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { supplier_id, name, phone_number, languages } = req.body ?? {};

        if (!supplier_id) {
            return res.status(400).json({ message: "supplier_id is required" });
        } else if (!name) {
            return res.status(400).json({ message: "name is required" });
        } else if (!phone_number) {
            return res.status(400).json({ message: "phone_number is required" });
        } else if (!languages) {
            return res.status(400).json({ message: "languages is required" });
        }

        await client.query("BEGIN");

        const supplierCheck = await client.query(
            "SELECT id FROM suppliers WHERE id = $1",
            [supplier_id]
        );

        if (supplierCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Supplier not found" });
        }

        const dupCheck = await client.query(
            "SELECT id FROM drivers WHERE phone_number = $1",
            [phone_number]
        );

        if (dupCheck.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({ message: "Driver with this phone number already exists" });
        }

        await client.query(
            `
            INSERT INTO drivers (supplier_id, name, phone_number, languages)
            VALUES ($1, $2, $3, $4);
            `,
            [supplier_id, name, phone_number, languages]
        );

        await client.query("COMMIT");

        return res.status(201).json({ message: "Driver created successfully" });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        } else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const createVehicle = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { supplier_id, car_type, ac_type, car_number } = req.body ?? {};

        if (!supplier_id) {
            return res.status(400).json({ message: "supplier_id is required" });
        } else if (!car_type) {
            return res.status(400).json({ message: "car_type is required" });
        } else if (!ac_type) {
            return res.status(400).json({ message: "ac_type is required" });
        } else if (!car_number) {
            return res.status(400).json({ message: "car_number is required" });
        }

        const validCarTypes = ["Go", "Comfort", "Edge", "Max"];
        if (!validCarTypes.includes(car_type)) {
            return res.status(400).json({
                message: `Invalid car_type. Must be one of: ${validCarTypes.join(", ")}`,
            });
        }

        const validAcTypes = ["AC", "Non-AC"];
        if (!validAcTypes.includes(ac_type)) {
            return res.status(400).json({
                message: `Invalid ac_type. Must be one of: ${validAcTypes.join(", ")}`,
            });
        }

        await client.query("BEGIN");

        const supplierCheck = await client.query(
            "SELECT id FROM suppliers WHERE id = $1",
            [supplier_id]
        );

        if (supplierCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Supplier not found" });
        }

        const dupCheck = await client.query(
            "SELECT id FROM vehicles WHERE car_number = $1",
            [car_number]
        );

        if (dupCheck.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({ message: "Vehicle with this car number already exists" });
        }

        await client.query(
            `
            INSERT INTO vehicles (supplier_id, car_type, ac_type, car_number)
            VALUES ($1, $2, $3, $4);
            `,
            [supplier_id, car_type, ac_type, car_number]
        );

        await client.query("COMMIT");

        return res.status(201).json({ message: "Vehicle created successfully" });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        } else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { booking_id, status, supplier_id, driver_id, vehicle_id } = req.body ?? {};

        if (!booking_id) {
            return res.status(400).json({ message: "booking_id is required" });
        }

        const validStatuses = ["ongoing", "completed", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatingAssignment = supplier_id || driver_id || vehicle_id;
        if (updatingAssignment && (!supplier_id || !driver_id || !vehicle_id)) {
            return res.status(400).json({
                message: "All three IDs are required: supplier_id, driver_id, vehicle_id",
            });
        }

        await client.query("BEGIN");

        const bookingCheck = await client.query(
            "SELECT id FROM bookings WHERE id = $1",
            [booking_id]
        );
        if (bookingCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Booking not found" });
        }

        if (updatingAssignment) {
            const supplierCheck = await client.query(
                "SELECT id FROM suppliers WHERE id = $1",
                [supplier_id]
            );
            if (supplierCheck.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Supplier not found" });
            }

            const driverCheck = await client.query(
                "SELECT id FROM drivers WHERE id = $1 AND supplier_id = $2",
                [driver_id, supplier_id]
            );
            if (driverCheck.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(400).json({ message: "Driver does not belong to the supplier" });
            }

            const vehicleCheck = await client.query(
                "SELECT id FROM vehicles WHERE id = $1 AND supplier_id = $2",
                [vehicle_id, supplier_id]
            );
            if (vehicleCheck.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(400).json({ message: "Vehicle does not belong to the supplier" });
            }
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (status) {
            updates.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (updatingAssignment) {
            updates.push(`supplier_id = $${paramIndex++}`);
            values.push(supplier_id);

            updates.push(`driver_id = $${paramIndex++}`);
            values.push(driver_id);

            updates.push(`vehicle_id = $${paramIndex++}`);
            values.push(vehicle_id);
        }

        if (updates.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "No valid fields to update" });
        }

        values.push(booking_id);

        const updateQuery = `
            UPDATE bookings
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING *;
        `;

        await client.query(updateQuery, values);

        await client.query("COMMIT");

        return res.status(200).json({ message: "Booking updated successfully" });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        } else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const createHotel = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { display_name, legal_name, address, pincode, lat_long } = req.body ?? {};

        if (!display_name) {
            return res.status(400).json({ message: "display_name is required" });
        } else if (!legal_name) {
            return res.status(400).json({ message: "legal_name is required" });
        } else if (!address) {
            return res.status(400).json({ message: "address is required" });
        } else if (!pincode) {
            return res.status(400).json({ message: "pincode is required" });
        } else if (!lat_long) {
            return res.status(400).json({ message: "lat_long is required" });
        }

        await client.query("BEGIN");

        await client.query(
            `
            INSERT INTO hotels (display_name, legal_name, address, pincode, lat_long)
            VALUES ($1, $2, $3, $4, $5);
            `,
            [display_name, legal_name, address, pincode, lat_long]
        );

        await client.query("COMMIT");

        return res.status(201).json({ message: "Hotel created successfully" });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        } else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const whatsappMessage = async (req: Request, res: Response) => {
    try {
        const { phone, message } = req.body ?? {};

        if (!phone) {
            return res.status(400).json({ message: "phone is required" });
        } else if (!message) {
            return res.status(400).json({ message: "message is required" });
        }

        await sendWhatsAppMessage("notification_five", phone, {
            body_1: {
                type: "text",
                value: message
            }
        });

        return res.status(201).json({
            message: "Message sent successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};