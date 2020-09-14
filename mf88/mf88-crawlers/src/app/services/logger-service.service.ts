import * as winston from 'winston';

const {timestamp, printf} = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export class LoggerService {
    private static instance: LoggerService;
    private logger: any;

    constructor() {
        this.logger = winston.createLogger({
            format    : winston.format.combine(
                timestamp(),
                myFormat),
            transports: [
                new winston.transports.Console({
                    level : 'info',
                    format: winston.format.simple(),
                }),
            ]

        });

    }
    static init(): LoggerService {
        if (!this.instance) {
            this.instance = new LoggerService();
        }
        return this.instance
    }

    print(message: string) {
        this.logger.info(`>>> ${message}`)
    }

    info(msg: string) {
        this.logger.info(msg);
    }

    warn(msg: string) {
        this.logger.warn(msg);
    }

    error(msg: string, data?: any) {
        this.logger.error(msg);
    }

}