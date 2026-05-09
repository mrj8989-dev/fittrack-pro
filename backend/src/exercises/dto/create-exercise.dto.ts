import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Press de banca' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Ejercicio de empuje para pecho' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Pecho' })
  @IsString()
  muscleGroup: string;

  @ApiPropertyOptional({ example: 'Barra y banco' })
  @IsOptional()
  @IsString()
  equipment?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=...' })
  @IsOptional()
  @IsString()
  videoUrl?: string;
}