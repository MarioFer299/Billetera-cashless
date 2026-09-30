import { IMovimientoRepository } from '../../domain/repositories/IMovimientoRepository.js';

export class RegistrarMovimientoUseCase {
  constructor(private repo: IMovimientoRepository) {}

  async execute(data: { asistente_id: number; tipo: string; monto: number; descripcion?: string }) {
    // 1. Validaciones de entrada
    if (!data.asistente_id || !Number.isInteger(data.asistente_id) || data.asistente_id < 1) {
      throw new Error('asistente_id debe ser un entero positivo');
    }

    if (!data.tipo || typeof data.tipo !== 'string') {
      throw new Error('tipo es requerido y debe ser string');
    }

    const tipoUpper = data.tipo.toUpperCase();
    if (!['RECARGA', 'CONSUMO'].includes(tipoUpper)) {
      throw new Error('tipo debe ser RECARGA o CONSUMO');
    }

    if (!data.monto || typeof data.monto !== 'number' || !Number.isInteger(data.monto)) {
      throw new Error('monto debe ser un número entero');
    }

    if (data.monto <= 0) {
      throw new Error('monto debe ser mayor a cero');
    }

    // 2. Validar que el asistente existe
    const asistenteExiste = await this.repo.asistenteExiste(data.asistente_id);
    if (!asistenteExiste) {
      throw new Error('El asistente no existe');
    }

    // 3. REGLA DE NEGOCIO: Saldo nunca en negativo
    if (tipoUpper === 'CONSUMO') {
      const saldoActual = await this.repo.calcularSaldo(data.asistente_id);
      
      if (saldoActual < data.monto) {
        throw new Error('Saldo insuficiente. Saldo actual: ' + saldoActual);
      }
    }

    // 4. Registrar el movimiento
    const nuevoMovimiento = await this.repo.create({
      asistente_id: data.asistente_id,
      tipo: tipoUpper,
      monto: data.monto,
      descripcion: data.descripcion || null,
      state: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    });

    // 5. Calcular y devolver el nuevo saldo
    const nuevoSaldo = await this.repo.calcularSaldo(data.asistente_id);

    return {
      ...nuevoMovimiento,
      saldo: nuevoSaldo
    };
  }
}