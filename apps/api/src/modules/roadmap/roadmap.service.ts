import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { LLM_SERVICE } from 'src/llm/anthropic-llm.service';
import type { LlmService } from 'src/llm/llm.interface';
import { roadmapTagToTaskTag } from 'src/llm/schemas';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class RoadmapService {
  constructor(
    private logger: LoggerService,
    @Inject(LLM_SERVICE) private llm: LlmService,
    private db: DatabaseService,
  ) {}

  async createRoadmap(user: User) {
    const roadmap = await this.llm.generateRoadmap(user);

    this.logger.info(`Creating roadmap entry`);
    return await this.db.$transaction(async (tx) => {
      await tx.roadmap.updateMany({
        where: { userId: user.id, status: 'ACTIVE' },
        data: { status: 'INACTIVE' },
      });

      return tx.roadmap.create({
        data: {
          generatedAt: new Date(),
          status: 'ACTIVE',
          userId: user.id,
          totalWeeks: roadmap.totalWeeks,
          weeks: {
            create: roadmap.weeks.map((week, i) => ({
              title: week.title,
              weekNumber: week.weekNumber,
              status: i === 0 ? 'ONGOING' : 'PENDING',
              tasks: {
                create: week.tasks.map((task) => ({
                  title: task.title,
                  tag: roadmapTagToTaskTag[task.tag],
                  duration: task.duration,
                  xp: task.xp,
                })),
              },
            })),
          },
        },
      });
    });
  }

  async getRoadmap(query: { userId: number }) {
    return this.db.roadmap.findMany({
      where: { userId: query.userId },
      include: { weeks: { include: { tasks: true } } },
    });
  }

  async updateTaskStatus(
    taskId: number,
    status: 'TODO' | 'COMPLETED',
    userId: number,
  ) {
    this.logger.info(`Task id ${taskId} status ${status} userId ${userId}`);
    const task = await this.db.roadmapTask.findFirst({
      where: {
        id: taskId,
        roadmapWeek: { roadmap: { userId } },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    return this.db.roadmapTask.update({
      where: { id: taskId },
      data: { status },
    });
  }
}
