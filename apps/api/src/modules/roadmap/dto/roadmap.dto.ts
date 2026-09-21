import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(['TODO', 'COMPLETED'])
  status!: 'TODO' | 'COMPLETED';
}
