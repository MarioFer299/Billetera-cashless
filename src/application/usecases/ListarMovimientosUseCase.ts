import {
  IMovimientoRepository,
  MovimientoFilters,
} from '../../domain/repositories/IMovimientoRepository.js';

export class ListarMovimientosUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(page: number, limit: number, filters: MovimientoFilters = {}) {
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new Error('page y limit deben ser enteros');
    }
    if (page < 1 || limit < 1) {
      throw new Error('page y limit deben ser positivos');
    }
    if (limit > 50) {
      throw new Error('limit máximo es 50');
    }

    if (filters.asistente_id !== undefined && (!Number.isInteger(filters.asistente_id) || filters.asistente_id < 1)) {
      throw new Error('asistente_id debe ser un entero positivo');
    }
    if (filters.tipo !== undefined && !['RECARGA', 'CONSUMO'].includes(filters.tipo)) {
      throw new Error('tipo debe ser RECARGA o CONSUMO');
    }

    return this.repo.findAll(page, limit, filters);
  }
}