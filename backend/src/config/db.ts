import { Pool } from "pg";

declare global {
  var __dbPool__: Pool | undefined;
}

export const pool: Pool = global.__dbPool__ ?? new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

if (!global.__dbPool__) {
  global.__dbPool__ = pool;
}

(async () => {
  // enable UUID generator
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  // users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone TEXT UNIQUE NOT NULL
    );
  `);

  // suppliers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      display_name VARCHAR(100) NOT NULL,
      legal_name VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      phone_number VARCHAR(10) UNIQUE NOT NULL
    );
  `);

  // drivers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      phone_number VARCHAR(15) UNIQUE NOT NULL,
      languages VARCHAR(100) NOT NULL
    );
  `);

  // vehicles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      car_type VARCHAR(50) NOT NULL,
      ac_type VARCHAR(20) NOT NULL,
      car_number VARCHAR(20) UNIQUE NOT NULL
    );
  `);

  // hotels table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      display_name VARCHAR(255) NOT NULL,
      legal_name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      pincode INTEGER NOT NULL,
      lat_long VARCHAR(255) NOT NULL
    );
  `);

  // bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      status VARCHAR(20) NOT NULL DEFAULT 'created'
        CHECK (status IN ('created', 'allocated', 'confirmed', 'assigned', 'completed', 'cancelled')),
      product_type VARCHAR(50) NOT NULL
        CHECK (product_type IN ('sameday', 'city_sightseeing', 'airport_transfer', 'overnight', 'experiences')),
      ac_type VARCHAR(20)
        CHECK (ac_type IN ('AC', 'Non-AC')),
      car_type VARCHAR(20)
        CHECK (car_type IN ('Go', 'Comfort', 'Edge', 'Max')),
      transfer_type VARCHAR(30)
        CHECK (transfer_type IN ('Drop to Airport', 'Pickup from Airport')),
      terminal VARCHAR(50),
      guest_count INT CHECK (guest_count >= 1 AND guest_count <= 4),
      date VARCHAR(10) NOT NULL
        CHECK (date ~ '^[0-9]{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$'),
      time VARCHAR(8) NOT NULL
        CHECK (time ~ '^(0?[1-9]|1[0-2])(:[0-5][0-9])? (AM|PM)$'),
      price NUMERIC(10,2) NOT NULL,
      payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid'
        CHECK (payment_status IN ('paid', 'unpaid', 'advance-paid', 'refunded')),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE SET NULL,
      listing_id VARCHAR(50),
      supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
      driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
      vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // payments table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      order_id VARCHAR(100),
      payment_id VARCHAR(100),
      amount NUMERIC(10,2),
      status VARCHAR(20) DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
      method VARCHAR(50)
    );
  `);
})();