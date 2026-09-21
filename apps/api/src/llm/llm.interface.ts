import { User } from '@prisma/client';
import { RoadmapResponse } from './schemas';

export interface LlmService {
  generateRoadmap(user: User): Promise<RoadmapResponse>;
}
