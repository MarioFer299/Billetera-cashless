import { Router } from 'express';
import { MovimientoController } from '../controllers/MovimientoController.js';

const router = Router();

router.get('/api/movimientos', MovimientoController.listar);
router.get('/api/movimientos/:id', MovimientoController.buscar);
router.post('/api/movimientos', MovimientoController.crear);

export default router;