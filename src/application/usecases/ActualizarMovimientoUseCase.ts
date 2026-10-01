import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

export class ActualizarMovimientoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(id: number, data: unknown) {
    if (!Number.isInteger(id) || id < 1) {
      throw new ApplicationError('id debe ser un entero positivo', 400);
    }

    if (!(await this.repo.findById(id))) {
      throw new ApplicationError('Movimiento no encontrado', 404);
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new ApplicationError('El cuerpo debe ser un objeto', 400);
    }

    const fields = Object.keys(data);
    if (fields.some((field) => field !== 'descripcion') || !fields.includes('descripcion')) {
      throw new ApplicationError('Solo descripcion es editable', 400);
    }

    const descripcion = (data as { descripcion?: unknown }).descripcion;
    if (descripcion !== null && typeof descripcion !== 'string') {
      throw new ApplicationError('descripcion debe ser texto', 400);
    }
    if (typeof descripcion === 'string' && descripcion.length > 200) {
      throw new ApplicationError('descripcion no puede superar 200 caracteres', 400);
    }

    return this.repo.updateDescripcion(id, descripcion ?? null);
  }
}
