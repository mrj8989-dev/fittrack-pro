import { IsUUID, IsOptional, IsInt, IsBoolean, IsNumber, Min, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionSetDto {
  @ApiProperty({ example: 'uuid-del-ejercicio' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  setNumber: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  reps?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}