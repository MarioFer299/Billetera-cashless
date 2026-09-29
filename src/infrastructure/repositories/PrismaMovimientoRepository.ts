import { prisma } from '../db/prismaClient';
import { IMovimientoRepository, Movimiento, PaginationResult } from '../../domain/repositories/IMovimientoRepository';

export class PrismaMovimientoRepository implements IMovimientoRepository {
  async findAll(page: number, limit: number): Promise<{ data: Movimiento[]; pagination: PaginationResult }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.movimientos.findMany({
        where: { state: { not: 'REMOVED' } },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.movimientos.count({
        where: { state: { not: 'REMOVED' } },
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Movimiento | null> {
    return prisma.movimientos.findFirst({
      where: { id, state: { not: 'REMOVED' } },
    });
  }

  async create(data: { asistente_id: number; tipo: string; monto: number; saldo: number }): Promise<Movimiento> {
    return prisma.movimientos.create({
      data: {
        ...data,
        state: 'ACTIVE',
      },
    });
  }

  async update(id: number, data: Partial<Movimiento>): Promise<Movimiento> {
    return prisma.movimientos.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Movimiento> {
    return prisma.movimientos.update({
      where: { id },
      data: { state: 'REMOVED' },
    });
  }

  async findLastByAsistente(asistente_id: number): Promise<Movimiento | null> {
    return prisma.movimientos.findFirst({
      where: { asistente_id, state: { not: 'REMOVED' } },
      orderBy: { id: 'desc' },
    });
  }
}