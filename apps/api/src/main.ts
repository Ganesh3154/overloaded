import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { LoggerService } from './logger/logger.service';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  app.setGlobalPrefix('/api/v1');
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
