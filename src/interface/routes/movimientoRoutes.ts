import { Router } from 'express';
import { MovimientoController } from '../controllers/MovimientoController.js';

const router = Router();
const ctrl = new MovimientoController();

router.get('/api/movimientos', (req, res) => ctrl.getAll(req, res));
router.get('/api/movimientos/:id', (req, res) => ctrl.getById(req, res));
router.post('/api/movimientos', (req, res) => ctrl.create(req, res));

export default router;