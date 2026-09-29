import { Request, Response } from 'express';
import { ListarMovimientosUseCase } from '../../application/usecases/ListarMovimientosUseCase.js';
import { CrearMovimientoUseCase } from '../../application/usecases/CrearMovimientoUseCase.js';
import { PrismaMovimientoRepository } from '../../infrastructure/repositories/PrismaMovimientoRepository.js';

const repo = new PrismaMovimientoRepository();
const listarUC = new ListarMovimientosUseCase(repo);
const crearUC = new CrearMovimientoUseCase(repo);

export class MovimientoController {
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await listarUC.execute(page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'id debe ser un entero positivo' });
      }
      const data = await repo.findById(id);
      if (!data) {
        return res.status(404).json({ error: 'Movimiento no encontrado' });
      }
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: 'Error interno' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await crearUC.execute(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}