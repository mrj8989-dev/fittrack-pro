import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkoutDto, userId: string) {
    // Verificar que el plan pertenece al usuario
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id: dto.workoutPlanId },
    });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    if (plan.userId !== userId) throw new ForbiddenException('No tienes acceso a este plan');

    return this.prisma.workout.create({
      data: dto,
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        workoutPlan: true,
      },
    });
    if (!workout) throw new NotFoundException('Workout no encontrado');
    if (workout.workoutPlan.userId !== userId) throw new ForbiddenException('No tienes acceso');
    return workout;
  }

  async update(id: string, dto: UpdateWorkoutDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workout.update({
      where: { id },
      data: dto,
      include: { exercises: { include: { exercise: true } } },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workout.delete({ where: { id } });
  }

  async addExercise(workoutId: string, dto: AddExerciseDto, userId: string) {
    await this.findOne(workoutId, userId);
    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        ...dto,
      },
      include: { exercise: true },
    });
  }

  async removeExercise(workoutId: string, exerciseId: string, userId: string) {
    await this.findOne(workoutId, userId);
    return this.prisma.workoutExercise.delete({
      where: { id: exerciseId },
    });
  }
}