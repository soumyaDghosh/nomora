import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import winston from "winston";
import mongoose from "mongoose";
import hotelRoutes from "./routes/hotelRoutes"
import authRoutes from "./routes/authRoutes"
import bookingRoutes from "./routes/bookingRoutes"
import adminRoutes from "./routes/adminRoutes"

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// const logtail = new Logtail(process.env.SOURCE_TOKEN!, {
//   endpoint: process.env.INGEST_HOST
// });
// const logger = winston.createLogger({
//   transports: [new LogtailTransport(logtail)]
// });

// app.use((req, res, next) => {
//   const start = Date.now();

//   let oldSend = res.send;
//   let responseBody: any;
//   res.send = function (body) {
//     responseBody = body;
//     return oldSend.call(this, body);
//   };

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     const status = res.statusCode;
//     const level =
//       status >= 500
//         ? "error"
//         : status >= 400
//           ? "warn"
//           : "info";

//     const message = `${req.method} ${req.originalUrl} → ${status}`;

//     logger.log({
//       level,
//       message,
//       method: req.method,
//       url: req.originalUrl,
//       status,
//       response_time_ms: duration,
//       response: responseBody,
//     });
//   });

//   next();
// });

app.get("/", (req, res) => res.send("OK"));
app.use("/api/hotel", hotelRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use((req, res) => res.status(403).send("Not found"));

mongoose.connect(process.env.MONGO_DB_URL as string)
  .then(async () => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on PORT ${port}`);
    });
  })
  .catch(err => console.log(`MongoDB connection error: ${err}`));