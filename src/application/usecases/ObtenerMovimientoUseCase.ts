import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

export class ObtenerMovimientoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(id: number) {
    if (!Number.isInteger(id) || id < 1) {
      throw new ApplicationError('id debe ser un entero positivo', 400);
    }

    const movimiento = await this.repo.findById(id);
    if (!movimiento) {
      throw new ApplicationError('Movimiento no encontrado', 404);
    }

    return movimiento;
  }
}