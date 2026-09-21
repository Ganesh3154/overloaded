import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

function toLogString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}

const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const trace = stack ? `\n${toLogString(stack)}` : '';
    return `${toLogString(timestamp)} ${level} ${toLogString(message)}${trace}`;
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

  private fmt(message: unknown, optionalParams: unknown[]): string {
    const serialized = toLogString(message);
    const context = optionalParams[0];
    return context ? `[${toLogString(context)}] ${serialized}` : serialized;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(this.fmt(message, optionalParams));
  }

  info(message: unknown, ...optionalParams: unknown[]) {
    this.logger.info(this.fmt(message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    const [stack, context] = optionalParams;
    this.logger.error(this.fmt(message, [context]), { stack });
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logger.warn(this.fmt(message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.logger.debug(this.fmt(message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.logger.verbose(this.fmt(message, optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.logger.error(this.fmt(message, optionalParams));
  }
}
