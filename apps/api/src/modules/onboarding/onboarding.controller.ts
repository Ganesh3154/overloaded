import { Body, Controller, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { User } from 'src/guards/auth.guard';
import { onboardingSchema, type OnboardingInput } from '@overloaded/shared';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('onboard')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}
  @Post()
  onboard(
    @User('sub') uid: string,
    @Body(new ZodValidationPipe(onboardingSchema)) data: OnboardingInput,
  ) {
    return this.onboardingService.onboard({ uid, ...data });
  }
}
