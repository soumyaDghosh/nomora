import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  let oldSend = res.send;
  let responseBody: any;
  res.send = function (body) {
    responseBody = body;
    return oldSend.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const level =
      status >= 500
        ? "error"
        : status >= 400
          ? "warn"
          : "info";

    const message = `${req.method} ${req.originalUrl} → ${status}`;

    logger.log({
      level,
      message,
      http: { 
        method: req.method,
        url: req.originalUrl,
        status_code: status,
      },
      response_time_ms: duration,
    });
  });

  next();
};
