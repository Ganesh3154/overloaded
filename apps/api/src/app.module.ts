import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CompanyModule } from './modules/company/company.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { DatabaseModule } from './database/database.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';

@Module({
  imports: [
    LoggerModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
      signOptions: {
        expiresIn: '1h',
        issuer: 'api.overloaded.com',
        audience: process.env.JWT_AUD,
      },
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    CompanyModule,
    OnboardingModule,
    RoadmapModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
