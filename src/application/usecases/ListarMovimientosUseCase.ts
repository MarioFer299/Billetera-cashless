import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';

export class ListarMovimientosUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(page: number, limit: number) {
    // Validaciones estrictas
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new Error('page y limit deben ser enteros');
    }
    if (page < 1 || limit < 1) {
      throw new Error('page y limit deben ser positivos');
    }
    if (limit > 50) {
      throw new Error('limit máximo es 50');
    }

    return this.repo.findAll(page, limit);
  }
}