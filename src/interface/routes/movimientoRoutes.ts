import { Router } from 'express';
import { MovimientoController } from '../controllers/MovimientoController.js';

const router = Router();

router.get('/api/movimientos', MovimientoController.listar);
router.get('/api/movimientos/:id', MovimientoController.buscar);
router.post('/api/movimientos', MovimientoController.crear);
router.patch('/api/movimientos/:id', MovimientoController.actualizar);
router.delete('/api/movimientos/:id', MovimientoController.eliminar);
router.get('/api/billeteras/:asistenteId/saldo', MovimientoController.saldo);

export default router;