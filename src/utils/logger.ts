import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import config from "@/config";

const { combine, colorize, timestamp, align, printf, errors, splat, json } =
  winston.format;

const logger = winston.createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new DailyRotateFile({
      filename: "combined-%DATE%.log",
      dirname: "logs",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!config.IS_PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    })
  );
}

export default logger;
