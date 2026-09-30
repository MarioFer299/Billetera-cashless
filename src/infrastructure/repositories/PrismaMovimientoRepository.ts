import { prisma } from '../db/prismaClient.js';
import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';

export class PrismaMovimientoRepository implements IMovimientoRepository {
  
  // 1. Método findAll (ESTE ES EL QUE ESTABA FALLANDO)
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.movimientos.findMany({
        where: { state: 'ACTIVE' },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      prisma.movimientos.count({
        where: { state: 'ACTIVE' }
      })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 2. Método findById
  async findById(id: number) {
    return prisma.movimientos.findFirst({
      where: { id, state: 'ACTIVE' }
    });
  }

  // 3. Método create
  async create(data: any) {
    return prisma.movimientos.create({
      data
    });
  }

  // 4. Método asistenteExiste
  async asistenteExiste(asistenteId: number): Promise<boolean> {
    const asistente = await prisma.asistentes.findFirst({
      where: { id: asistenteId }
    });
    return asistente !== null;
  }

  // 5. Método calcularSaldo
  async calcularSaldo(asistenteId: number): Promise<number> {
    const movimientos = await prisma.movimientos.findMany({
      where: {
        asistente_id: asistenteId,
        state: 'ACTIVE'
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