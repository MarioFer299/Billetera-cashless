import { Request, Response } from 'express';
import { ListarMovimientosUseCase } from '../../application/usecases/ListarMovimientosUseCase.js';
import { RegistrarMovimientoUseCase } from '../../application/usecases/RegistrarMovimientoUseCase.js';
import { PrismaMovimientoRepository } from '../../infrastructure/repositories/PrismaMovimientoRepository.js';

// Instanciamos el repositorio UNA sola vez
const repo = new PrismaMovimientoRepository();

// Se lo pasamos a los casos de uso
const listarUC = new ListarMovimientosUseCase(repo);
const registrarUC = new RegistrarMovimientoUseCase(repo);

export class MovimientoController {
  
  static async listar(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await listarUC.execute(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async buscar(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const movimiento = await repo.findById(id);
      
      if (!movimiento) {
        return res.status(404).json({ error: 'Movimiento no encontrado' });
      }
      
      res.json({ data: movimiento });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const data = await registrarUC.execute(req.body);
      res.status(201).json({ data });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}