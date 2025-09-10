import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  // await pool.query(`DROP TYPE IF EXISTS transfer_detail CASCADE;`);

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

  // trip_detail type
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trip_detail') THEN
        CREATE TYPE trip_detail AS (
          hotel_id UUID,
          ac_type VARCHAR(20),
          car_type VARCHAR(20),
          date VARCHAR(10),
          time VARCHAR(10)
        );
      END IF;
    END$$;
  `);

  // transfer_detail type
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transfer_detail') THEN
        CREATE TYPE transfer_detail AS (
          type VARCHAR(50),
          from_location TEXT,
          to_location TEXT,
          terminal TEXT,
          date VARCHAR(10),
          time VARCHAR(10),
          guest_count INT
        );
      END IF;
    END$$;
  `);

  // bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('ongoing', 'completed', 'cancelled')),
      product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('sameday', 'city_sightseeing', 'airport_transfer', 'overnight', 'experiences')),
      trip_details trip_detail,
      transfer_details transfer_detail,
      price NUMERIC(10,2) NOT NULL,
      listing_id TEXT NOT NULL,
      supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
      driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
      vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
})();