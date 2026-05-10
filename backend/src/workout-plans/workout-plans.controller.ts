import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('workout-plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private workoutPlansService: WorkoutPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Crear plan de entrenamiento' })
  create(
    @Body() dto: CreateWorkoutPlanDto,
    @CurrentUser() user: any,
  ) {
    return this.workoutPlansService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener mis planes de entrenamiento' })
  findAll(@CurrentUser() user: any) {
    return this.workoutPlansService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plan por id' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.workoutPlansService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar plan de entrenamiento' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkoutPlanDto,
    @CurrentUser() user: any,
  ) {
    return this.workoutPlansService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plan de entrenamiento' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.workoutPlansService.remove(id, user.id);
  }
}