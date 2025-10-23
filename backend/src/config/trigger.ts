import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.NEON_DB_URL,
});

export async function setupTrigger(): Promise<void> {
  try {
    await client.connect();

    await client.query(`
      CREATE OR REPLACE FUNCTION update_status_on_payment() RETURNS trigger AS $$
      BEGIN
        IF NEW.payment_status IN ('paid', 'advance-paid') AND OLD.payment_status = 'unpaid' THEN
          NEW.status := 'confirmed';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_status_on_supplier() RETURNS trigger AS $$
      BEGIN
        IF NEW.supplier_id IS NOT NULL AND OLD.supplier_id IS DISTINCT FROM NEW.supplier_id THEN
          NEW.status := 'allocated';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_status_on_driver() RETURNS trigger AS $$
      BEGIN
        IF NEW.driver_id IS NOT NULL AND OLD.driver_id IS DISTINCT FROM NEW.driver_id THEN
          NEW.status := 'assigned';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`DROP TRIGGER IF EXISTS update_status_on_payment_trigger ON bookings;`);
    await client.query(`DROP TRIGGER IF EXISTS update_status_on_supplier_trigger ON bookings;`);
    await client.query(`DROP TRIGGER IF EXISTS update_status_on_driver_trigger ON bookings;`);

    await client.query(`
      CREATE TRIGGER update_status_on_payment_trigger
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_status_on_payment();
    `);
    
    await client.query(`
      CREATE TRIGGER update_status_on_supplier_trigger
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_status_on_supplier();
    `);

    await client.query(`
      CREATE TRIGGER update_status_on_driver_trigger
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_status_on_driver();
    `);

    console.log('Triggers set up successfully.');
  } catch (err) {
    console.error('Error setting up triggers:', err);
  } finally {
    await client.end();
  }
}