import winston, { createLogger, transports } from "winston";

const myformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

export const userLogger = createLogger({
  transports: [
    new transports.Console({
      format: myformat,
    }),
  ],
});
