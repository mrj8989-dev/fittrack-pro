import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-workout-plan.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkoutPlanDto, userId: string) {
    return this.prisma.workoutPlan.create({
      data: {
        ...dto,
        userId,
      },
      include: { workouts: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workoutPlan.findMany({
      where: { userId },
      include: {
        workouts: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        workouts: {
          include: {
            exercises: {
              include: { exercise: true },
            },
          },
        },
      },
    });

    if (!plan) throw new NotFoundException(`Plan con id ${id} no encontrado`);
    if (plan.userId !== userId) throw new ForbiddenException('No tienes acceso a este plan');

    return plan;
  }

  async update(id: string, dto: UpdateWorkoutPlanDto, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workoutPlan.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.workoutPlan.delete({
      where: { id },
    });
  }
}