import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const trace = stack ? `\n${stack}` : '';
    return `${timestamp} ${level} ${message}${trace}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
      format: isProduction ? prodFormat : devFormat,
      transports: [new winston.transports.Console()],
    });
  }

  private fmt(message: any, optionalParams: any[]): string {
    const serialized =
      typeof message === 'object' ? JSON.stringify(message) : message;
    const context = optionalParams[0];
    return context ? `[${context}] ${serialized}` : serialized;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(this.fmt(message, optionalParams));
  }

  info(message: any, ...optionalParams: any[]) {
    this.logger.info(this.fmt(message, optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    const [stack, context] = optionalParams;
    this.logger.error(this.fmt(message, [context]), { stack });
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(this.fmt(message, optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(this.fmt(message, optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.verbose(this.fmt(message, optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.logger.error(this.fmt(message, optionalParams));
  }
}
