import { PrismaClient } from '../../generated/prisma/index.js'; // Ajusta si tu carpeta se llama diferente
import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';

const prisma = new PrismaClient();

export class PrismaMovimientoRepository implements IMovimientoRepository {
  
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

  async findById(id: number) {
    return prisma.movimientos.findFirst({
      where: { id, state: 'ACTIVE' }
    });
  }

  async create(data: any) {
    return prisma.movimientos.create({
      data
    });
  }

  async asistenteExiste(asistenteId: number): Promise<boolean> {
    const asistente = await prisma.asistentes.findFirst({
      where: { id: asistenteId } // Puedes agregar state: 'ACTIVE' si la tabla asistentes lo tiene
    });
    return asistente !== null;
  }

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