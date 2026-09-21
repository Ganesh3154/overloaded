import { Body, Controller, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { User } from 'src/guards/auth.guard';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('onboard')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}
  @Post()
  onboard(@User('sub') uid: string, @Body() data: OnboardingDto) {
    return this.onboardingService.onboard({ uid, ...data });
  }
}
