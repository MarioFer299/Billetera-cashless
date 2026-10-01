import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

export class ConsultarSaldoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(asistenteId: number) {
    if (!Number.isInteger(asistenteId) || asistenteId < 1) {
      throw new ApplicationError('asistenteId debe ser un entero positivo', 400);
    }
    if (!(await this.repo.asistenteExiste(asistenteId))) {
      throw new ApplicationError('El asistente no existe', 404);
    }

    return {
      asistente_id: asistenteId,
      saldo: await this.repo.calcularSaldo(asistenteId),
    };
  }
}