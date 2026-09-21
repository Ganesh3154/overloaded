import { Module } from '@nestjs/common';
import { AnthropicLlmService, LLM_SERVICE } from './anthropic-llm.service';

@Module({
  providers: [
    {
      provide: LLM_SERVICE,
      useClass: AnthropicLlmService,
    },
  ],
  exports: [LLM_SERVICE],
})
export class LlmModule {}
