import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutPlanDto {
  @ApiProperty({ example: 'Plan fuerza 12 semanas' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Plan enfocado en ganar fuerza máxima' })
  @IsOptional()
  @IsString()
  description?: string;
}