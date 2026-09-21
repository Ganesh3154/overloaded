import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { UserModule } from '../user/user.module';
import { RoadmapModule } from '../roadmap/roadmap.module';

@Module({
  imports: [UserModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
