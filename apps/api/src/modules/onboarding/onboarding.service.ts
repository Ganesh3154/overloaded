import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { UserService } from '../user/user.service';
import type { OnboardingInput } from '@overloaded/shared';
import { RoadmapService } from '../roadmap/roadmap.service';

@Injectable()
export class OnboardingService {
  constructor(
    private logger: LoggerService,
    private userService: UserService,
  ) {}
  async onboard({ uid, ...data }: { uid: string } & OnboardingInput) {
    this.logger.info(`Onboarding user: ${uid}`);

    const user = await this.userService.updateByUid(uid, data);

    this.logger.info(`Onboarding complete ${user}`);
    return user;
  }
}
