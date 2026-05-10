import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBodyRevisionDto {
  @ApiProperty({ example: 70.5 })
  @IsNumber()
  @Min(30)
  @Max(300)
  weight: number;

  @ApiPropertyOptional({ example: 15.5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  bodyFat?: number;

  @ApiPropertyOptional({ example: 95 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  chestCm?: number;

  @ApiPropertyOptional({ example: 78 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  waistCm?: number;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  armsCm?: number;

  @ApiPropertyOptional({ example: 55 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  legsCm?: number;

  @ApiPropertyOptional({ example: 'Me noto más definido esta semana' })
  @IsOptional()
  @IsString()
  notes?: string;
}