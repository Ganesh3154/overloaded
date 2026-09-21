import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { LlmModule } from 'src/llm/llm.module';
import { RoadmapController } from './roadmap.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [LlmModule, UserModule],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}
