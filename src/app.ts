import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movimientoRoutes from './interface/routes/movimientoRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(movimientoRoutes);

const PORT = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`API Billetera Cashless corriendo en puerto ${PORT}`);
});