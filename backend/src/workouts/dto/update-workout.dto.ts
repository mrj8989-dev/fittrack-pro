import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateWorkoutDto } from './create-workout.dto';

export class UpdateWorkoutDto extends PartialType(
  OmitType(CreateWorkoutDto, ['workoutPlanId'] as const)
) {}