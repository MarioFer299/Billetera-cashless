import { prisma } from '../db/prismaClient.js';
import {
  IMovimientoRepository,
  MovimientoFilters,
  MovimientoInput,
} from '../../domain/repositories/IMovimientoRepository.js';

export class PrismaMovimientoRepository implements IMovimientoRepository {
  async findAll(page: number, limit: number, filters: MovimientoFilters = {}) {
    const skip = (page - 1) * limit;
    const where = {
      state: 'ACTIVE',
      ...(filters.asistente_id !== undefined && { asistente_id: filters.asistente_id }),
      ...(filters.tipo !== undefined && { tipo: filters.tipo }),
    };

    const [data, total] = await Promise.all([
      prisma.movimientos.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      prisma.movimientos.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    return prisma.movimientos.findFirst({
      where: { id, state: 'ACTIVE' },
    });
  }

  async create(data: MovimientoInput) {
    return prisma.movimientos.create({ data });
  }

  async updateDescripcion(id: number, descripcion: string | null) {
    return prisma.movimientos.update({
      where: { id },
      data: { descripcion },
    });
  }

  async delete(id: number) {
    return prisma.movimientos.update({
      where: { id },
      data: { state: 'INACTIVE', updated_at: new Date() },
    });
  }

  async asistenteExiste(asistenteId: number): Promise<boolean> {
    const asistente = await prisma.asistentes.findUnique({ where: { id: asistenteId } });
    return asistente !== null;
  }

  async calcularSaldo(asistenteId: number, excludedId?: number): Promise<number> {
    const movimientos = await prisma.movimientos.findMany({
      where: {
        asistente_id: asistenteId,
        state: 'ACTIVE',
        ...(excludedId !== undefined && { id: { not: excludedId } }),
      }
    });

    let saldo = 0;
    for (const mov of movimientos) {
      if (mov.tipo === 'RECARGA') {
        saldo += mov.monto;
      } else if (mov.tipo === 'CONSUMO') {
        saldo -= mov.monto;
      }
    }

    return saldo;
  }
}