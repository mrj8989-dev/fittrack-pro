import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WorkoutSessionsService } from './workout-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateSessionSetDto } from './dto/create-session-set.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workout-sessions')
export class WorkoutSessionsController {
  constructor(private workoutSessionsService: WorkoutSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar nueva sesión de entrenamiento' })
  create(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.workoutSessionsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener historial de sesiones' })
  findAll(@CurrentUser() user: any) {
    return this.workoutSessionsService.findAll(user.id);
  }

  @Get('records')
  @ApiOperation({ summary: 'Obtener récords personales por ejercicio' })
  getPersonalRecords(@CurrentUser() user: any) {
    return this.workoutSessionsService.getPersonalRecords(user.id);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Obtener progreso de un ejercicio a lo largo del tiempo' })
  @ApiQuery({ name: 'exerciseId', required: true })
  getProgress(
    @CurrentUser() user: any,
    @Query('exerciseId') exerciseId: string,
  ) {
    return this.workoutSessionsService.getProgress(user.id, exerciseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sesión por id' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.workoutSessionsService.findOne(id, user.id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Marcar sesión como completada' })
  complete(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.workoutSessionsService.complete(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar sesión' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.workoutSessionsService.remove(id, user.id);
  }

  @Post(':id/sets')
  @ApiOperation({ summary: 'Registrar una serie dentro de una sesión' })
  addSet(
    @Param('id') id: string,
    @Body() dto: CreateSessionSetDto,
    @CurrentUser() user: any,
  ) {
    return this.workoutSessionsService.addSet(id, dto, user.id);
  }
}