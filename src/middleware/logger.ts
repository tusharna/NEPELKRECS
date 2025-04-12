import { version } from "os";
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const transport = new DailyRotateFile({
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d' // Keep logs for 14 days
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'user-service', buildinfo: {
            version: '1.0.0',
            nodeVersion: process.version,
            osVersion: version(),
            arch: process.arch,
            platform: process.platform,
        }
    },
    transports: [
        transport,
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File({ format: winston.format.combine(winston.format.json(), winston.format.timestamp()), filename: 'combined.log' }),
        new winston.transports.File({ format: winston.format.combine(winston.format.json(), winston.format.timestamp()), filename: 'error.log', level: 'error' }),

    ],
})



export default logger