import w, { Logform } from "winston"
export const logger = w.createLogger({
    level: "info",
    format: w.format.combine(
        w.format.timestamp(),
        w.format.simple()
    ),
    transports: [
        new w.transports.Console({
            format: w.format.combine(
                w.format.colorize(),
                w.format.simple()),
        }),
        new w.transports.File({
            filename: 'logs/app.log',
            level: 'info',
        }),

    ],
})
