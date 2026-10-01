export type MovimientoInput = {
  asistente_id: number;
  tipo: 'RECARGA' | 'CONSUMO';
  monto: number;
  descripcion?: string | null;
};

export type MovimientoFilters = {
  asistente_id?: number;
  tipo?: 'RECARGA' | 'CONSUMO';
};

export interface IMovimientoRepository {
  findAll(page: number, limit: number, filters?: MovimientoFilters): Promise<unknown>;
  findById(id: number): Promise<unknown | null>;
  create(data: MovimientoInput): Promise<unknown>;
  updateDescripcion(id: number, descripcion: string | null): Promise<unknown>;
  delete(id: number): Promise<unknown>;
  asistenteExiste(asistenteId: number): Promise<boolean>;
  calcularSaldo(asistenteId: number, excludedId?: number): Promise<number>;
}