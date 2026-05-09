import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: dto,
    });
  }

  async findAll(muscleGroup?: string, equipment?: string) {
    return this.prisma.exercise.findMany({
      where: {
        ...(muscleGroup && { muscleGroup }),
        ...(equipment && { equipment }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });
    if (!exercise) {
      throw new NotFoundException(`Ejercicio con id ${id} no encontrado`);
    }
    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id); // Verifica que existe antes de actualizar
    return this.prisma.exercise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica que existe antes de eliminar
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}