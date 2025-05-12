import winston from 'winston';
import 'winston-daily-rotate-file';

const loggerTransport = new (winston.transports.DailyRotateFile)({
  filename: 'logs/all-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'debug'
});

const errorloggerTransport = new (winston.transports.DailyRotateFile)({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
});

const createLogger = (level: string, ...transports: winston.transport[]) => winston.createLogger({
  // This method set the current severity based on
  // the current NODE_ENV: show all the log levels
  // if the server was run in development mode; otherwise,
  // if it was run in production, show only warn and error messages
  level,
  // Define severity levels
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  format: winston.format.printf(info => JSON.stringify(info.message)),
  transports
});

export const logger = createLogger('debug', loggerTransport);
export const errorlogger = createLogger('error', new winston.transports.Console(), errorloggerTransport);
