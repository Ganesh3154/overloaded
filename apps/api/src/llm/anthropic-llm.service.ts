import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LlmService } from './llm.interface';
import { User } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import { ROADMAP_SYSTEM_PROMPT } from './prompts';
import { ROADMAP_OUTPUT_SCHEMA, RoadmapResponse } from './schemas';
import { LoggerService } from 'src/logger/logger.service';

export const LLM_SERVICE = 'LLM_SERVICE';

@Injectable()
export class AnthropicLlmService implements LlmService {
  client: Anthropic;

  constructor(private logger: LoggerService) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  async generateRoadmap(user: User): Promise<RoadmapResponse> {
    this.logger.info(`Generating roadmap for ${user}`);
    const prompt =
      `Generate a roadmap for this candidate:\n\n${JSON.stringify(user, null, 2)}`.trim();

    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: ROADMAP_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: prompt }],
      output_config: {
        format: { type: 'json_schema', schema: ROADMAP_OUTPUT_SCHEMA },
      },
    });

    const block = response.content[0];
    if (block.type !== 'text')
      throw new InternalServerErrorException(
        'Unexpected response type from LLM',
      );

    const roadmapResponse = JSON.parse(block.text);
    this.logger.info(`Generated roadmap ${roadmapResponse}`);

    return JSON.parse(block.text);
  }
}
