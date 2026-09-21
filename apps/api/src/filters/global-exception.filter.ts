import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2002: {
    status: HttpStatus.CONFLICT,
    message: 'A record already exists',
  },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Foreign key constraint failed',
  },
  P2014: { status: HttpStatus.BAD_REQUEST, message: 'Relation violation' },
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.resolve(exception);
    const displayMessage =
      typeof message === 'string' ? message : JSON.stringify(message);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} ${status} — ${displayMessage}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} ${status} — ${displayMessage}`,
        exception,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }

  private resolve(exception: unknown): { status: number; message: unknown } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'object' && body !== null && 'message' in body
          ? (body as Record<string, unknown>).message
          : body;
      return { status, message };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERROR_MAP[exception.code];
      if (mapped) return mapped;
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid data provided',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
