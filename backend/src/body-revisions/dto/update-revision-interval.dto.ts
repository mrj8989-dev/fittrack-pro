import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRevisionIntervalDto {
  @ApiProperty({ example: 14, description: 'Intervalo en días entre revisiones (7, 14, 21, 28)' })
  @IsInt()
  @Min(7)
  @Max(28)
  revisionInterval: number;
}