import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from 'src/guards/auth.guard';
import { LoggerService } from 'src/logger/logger.service';
import { UserService } from '../user/user.service';
import {
  updateTaskStatusSchema,
  type UpdateTaskStatusInput,
} from '@overloaded/shared';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private logger: LoggerService,
    private userService: UserService,
    private roadmapService: RoadmapService,
  ) {}
  @Post()
  async regenerate(@User() user) {
    const userProfile = await this.userService.find({ id: user.id });
    if (!userProfile) {
      this.logger.error(`User not found`);
      throw new NotFoundException('User not found');
    }

    this.logger.info(`Regenerating roadmap for user ${user.id}`);
    const roadmap = await this.roadmapService.createRoadmap(userProfile);

    return roadmap;
  }

  @Get()
  async getRoadmaps(@User() user) {
    return await this.roadmapService.getRoadmap({ userId: user.id });
  }

  @Patch('task/:id')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body(new ZodValidationPipe(updateTaskStatusSchema))
    dto: UpdateTaskStatusInput,
    @User() user,
  ) {
    return this.roadmapService.updateTaskStatus(taskId, dto.status, user.id);
  }
}
