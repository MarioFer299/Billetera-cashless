import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';
import { ApplicationError } from '../errors/ApplicationError.js';

export class RegistrarMovimientoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(data: { asistente_id?: unknown; tipo?: unknown; monto?: unknown; descripcion?: unknown }) {
    const allowedFields = ['asistente_id', 'tipo', 'monto', 'descripcion'];
    const extraFields = Object.keys(data).filter((field) => !allowedFields.includes(field));
    if (extraFields.length > 0) {
      throw new ApplicationError('El cuerpo contiene campos no permitidos', 400);
    }

    if (!Number.isInteger(data.asistente_id) || (data.asistente_id as number) < 1) {
      throw new ApplicationError('asistente_id debe ser un entero positivo', 400);
    }

    if (typeof data.tipo !== 'string') {
      throw new ApplicationError('tipo es requerido y debe ser string', 400);
    }

    const tipoUpper = data.tipo.toUpperCase() as 'RECARGA' | 'CONSUMO';
    if (!['RECARGA', 'CONSUMO'].includes(tipoUpper)) {
      throw new ApplicationError('tipo debe ser RECARGA o CONSUMO', 400);
    }

    if (!Number.isInteger(data.monto) || (data.monto as number) <= 0) {
      throw new ApplicationError('monto debe ser un entero positivo', 400);
    }

    if (data.descripcion !== undefined && data.descripcion !== null && typeof data.descripcion !== 'string') {
      throw new ApplicationError('descripcion debe ser texto', 400);
    }

    if (typeof data.descripcion === 'string' && data.descripcion.length > 200) {
      throw new ApplicationError('descripcion no puede superar 200 caracteres', 400);
    }

    const asistenteId = data.asistente_id as number;
    const monto = data.monto as number;
    const asistenteExiste = await this.repo.asistenteExiste(asistenteId);
    if (!asistenteExiste) {
      throw new ApplicationError('El asistente no existe', 404);
    }

    if (tipoUpper === 'RECARGA' && (monto < 10000 || monto > 2000000)) {
      throw new ApplicationError('La RECARGA debe estar entre 10000 y 2000000', 400);
    }

    if (tipoUpper === 'CONSUMO') {
      const saldoActual = await this.repo.calcularSaldo(asistenteId);

      if (saldoActual < monto) {
        throw new ApplicationError('Saldo insuficiente para realizar esta transacción', 409);
      }
    }

    return this.repo.create({
      asistente_id: asistenteId,
      tipo: tipoUpper,
      monto,
      descripcion: (data.descripcion as string | null | undefined) ?? null,
    });
  }
}