import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddExerciseDto {
  @ApiProperty({ example: 'uuid-del-ejercicio' })
  @IsUUID()
  exerciseId: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  sets: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  reps?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 90 })
  @IsOptional()
  @IsInt()
  @Min(1)
  restTime?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;
}