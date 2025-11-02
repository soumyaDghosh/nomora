import "dotenv/config";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";

// Create the Logtail client
const logtail = new Logtail(process.env.SOURCE_TOKEN!, {
  endpoint: process.env.INGEST_HOST,
});

// Create the Winston logger
export const logger = winston.createLogger({
  level: "info",
  transports: [
    new LogtailTransport(logtail),
    
    // Also, log to the console when not in production
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : [])
  ],
});
