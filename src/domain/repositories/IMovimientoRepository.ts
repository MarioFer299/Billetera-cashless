export interface Movimiento {
  id: number;
  asistente_id: number;
  tipo: string;       // 'RECARGA' o 'CONSUMO'
  monto: number;
  saldo: number;
  state: string;      // 'ACTIVE' o 'REMOVED'
  created_at?: Date;  // ajusta según tu schema
}

export interface PaginationResult {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface IMovimientoRepository {
  findAll(page: number, limit: number): Promise<{ data: Movimiento[]; pagination: PaginationResult }>;
  findById(id: number): Promise<Movimiento | null>;
  create(data: { asistente_id: number; tipo: string; monto: number; saldo: number }): Promise<Movimiento>;
  update(id: number, data: Partial<Movimiento>): Promise<Movimiento>;
  softDelete(id: number): Promise<Movimiento>;
  findLastByAsistente(asistente_id: number): Promise<Movimiento | null>;
}