import { IsString, IsOptional, IsInt, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutDto {
  @ApiProperty({ example: 'Día 1 - Pecho y Tríceps' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number;

  @ApiProperty({ example: 'uuid-del-plan' })
  @IsUUID()
  workoutPlanId: string;
}