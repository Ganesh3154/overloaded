import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OnboardingDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsNumber()
  @IsNotEmpty()
  yearsOfExperience!: number;

  @IsArray()
  @IsString({ each: true })
  learningStyle!: string[];

  @IsArray()
  @IsString({ each: true })
  techStack!: string[];

  @IsNumber()
  @IsNotEmpty()
  dsaLevel!: number;

  @IsNumber()
  @IsNotEmpty()
  systemDesignLevel!: number;

  @IsNumber()
  @IsNotEmpty()
  behavioralConfidence!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  targetCompanies!: number[];

  @IsArray()
  @IsString({ each: true })
  skillsToLearn!: string[];

  @IsNumber()
  prepTime!: number;

  @IsNumber()
  hrsPerDay!: number;
}
