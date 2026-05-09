import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ejercicio' })
  create(@Body() dto: CreateExerciseDto) {
    return this.exercisesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ejercicios con filtros opcionales' })
  @ApiQuery({ name: 'muscleGroup', required: false, example: 'Pecho' })
  @ApiQuery({ name: 'equipment', required: false, example: 'Barra' })
  findAll(
    @Query('muscleGroup') muscleGroup?: string,
    @Query('equipment') equipment?: string,
  ) {
    return this.exercisesService.findAll(muscleGroup, equipment);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ejercicio por id' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar ejercicio' })
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercisesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ejercicio' })
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }
}