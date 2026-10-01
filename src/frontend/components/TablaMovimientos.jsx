'use client';

export default function TablaMovimientos({
  movimientos,
  pagination,
  page,
  limit,
  moneyFormatter,
  dateFormatter,
  onRowClick,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(pagination.totalPages || 1, 1);

  return (
    <section>
      <h2>Movimientos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asistente</th>
            <th>Tipo</th>
            <th className="num">Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length ? (
            movimientos.map((m) => (
              <tr key={m.id} onClick={() => onRowClick(m.id)}>
                <td>{m.id}</td>
                <td>{m.asistente_id}</td>
                <td>
                  <span className={`tag ${m.tipo}`}>{m.tipo}</span>
                </td>
                <td className="num">{moneyFormatter(m.monto)}</td>
                <td>{dateFormatter(m.created_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty">
                Sin movimientos
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pager">
        <span>
          Página {pagination.currentPage || 1} de {totalPages} ·{' '}
          {pagination.total || 0} movimientos
        </span>
        <div>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <button
            className="ghost"
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </button>
          <button
            className="ghost"
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}