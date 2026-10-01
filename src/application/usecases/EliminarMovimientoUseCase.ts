import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

type Movimiento = { asistente_id: number; tipo: string };

export class EliminarMovimientoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(id: number) {
    if (!Number.isInteger(id) || id < 1) {
      throw new ApplicationError('id debe ser un entero positivo', 400);
    }

    const movimiento = (await this.repo.findById(id)) as Movimiento | null;
    if (!movimiento) {
      throw new ApplicationError('Movimiento no encontrado', 404);
    }

    if (movimiento.tipo === 'RECARGA') {
      const saldoPosterior = await this.repo.calcularSaldo(movimiento.asistente_id, id);
      if (saldoPosterior < 0) {
        throw new ApplicationError('Anular la RECARGA dejaría el saldo negativo', 409);
      }
    }

    return this.repo.delete(id);
  }
}