import {
  IMovimientoRepository,
  MovimientoFilters,
} from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

export class ListarMovimientosUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(page: number, limit: number, filters: MovimientoFilters = {}) {
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      throw new ApplicationError('page y limit deben ser enteros', 400);
    }
    if (page < 1 || limit < 1) {
      throw new ApplicationError('page y limit deben ser positivos', 400);
    }
    if (limit > 50) {
      throw new ApplicationError('limit máximo es 50', 400);
    }

    if (filters.asistente_id !== undefined && (!Number.isInteger(filters.asistente_id) || filters.asistente_id < 1)) {
      throw new ApplicationError('asistente_id debe ser un entero positivo', 400);
    }
    if (filters.tipo !== undefined && !['RECARGA', 'CONSUMO'].includes(filters.tipo)) {
      throw new ApplicationError('tipo debe ser RECARGA o CONSUMO', 400);
    }

    return this.repo.findAll(page, limit, filters);
  }
}