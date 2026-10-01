import { Request, Response } from 'express';
import { ListarMovimientosUseCase } from '../../application/usecases/ListarMovimientosUseCase.js';
import { RegistrarMovimientoUseCase } from '../../application/usecases/RegistrarMovimientoUseCase.js';
import { ObtenerMovimientoUseCase } from '../../application/usecases/ObtenerMovimientoUseCase.js';
import { ActualizarMovimientoUseCase } from '../../application/usecases/ActualizarMovimientoUseCase.js';
import { EliminarMovimientoUseCase } from '../../application/usecases/EliminarMovimientoUseCase.js';
import { ConsultarSaldoUseCase } from '../../application/usecases/ConsultarSaldoUseCase.js';
import { PrismaMovimientoRepository } from '../../infrastructure/repositories/PrismaMovimientoRepository.js';

// Instanciamos el repositorio UNA sola vez
const repo = new PrismaMovimientoRepository();

// Se lo pasamos a los casos de uso
const listarUC = new ListarMovimientosUseCase(repo);
const registrarUC = new RegistrarMovimientoUseCase(repo);
const obtenerUC = new ObtenerMovimientoUseCase(repo);
const actualizarUC = new ActualizarMovimientoUseCase(repo);
const eliminarUC = new EliminarMovimientoUseCase(repo);
const saldoUC = new ConsultarSaldoUseCase(repo);

function responderError(res: Response, error: unknown) {
  const typedError = error as { message?: string; statusCode?: number };
  return res.status(typedError.statusCode ?? 500).json({ error: typedError.message ?? 'Error interno' });
}

export class MovimientoController {
  
  static async listar(req: Request, res: Response) {
    try {
      const page = req.query.page === undefined ? 1 : Number(req.query.page);
      const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
      const asistente_id = req.query.asistente_id === undefined ? undefined : Number(req.query.asistente_id);
      const tipo = req.query.tipo === undefined ? undefined : String(req.query.tipo).toUpperCase();

      const result = await listarUC.execute(page, limit, {
        asistente_id,
        tipo: tipo as 'RECARGA' | 'CONSUMO' | undefined,
      });
      res.json(result);
    } catch (error: any) {
      responderError(res, error);
    }
  }

  static async buscar(req: Request, res: Response) {
    try {
      const movimiento = await obtenerUC.execute(Number(req.params.id));
      res.json({ data: movimiento });
    } catch (error: any) {
      responderError(res, error);
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const data = await registrarUC.execute(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      responderError(res, error);
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const data = await actualizarUC.execute(Number(req.params.id), req.body);
      res.json({ data });
    } catch (error: any) {
      responderError(res, error);
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const data = await eliminarUC.execute(Number(req.params.id));
      res.json({ data });
    } catch (error: any) {
      responderError(res, error);
    }
  }

  static async saldo(req: Request, res: Response) {
    try {
      const data = await saldoUC.execute(Number(req.params.asistenteId));
      res.json({ data });
    } catch (error: any) {
      responderError(res, error);
    }
  }
}