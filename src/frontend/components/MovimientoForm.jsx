'use client';

import { useState } from 'react';

export default function MovimientoForm({ onSubmit }) {
  const [asis, setAsis] = useState('');
  const [tipo, setTipo] = useState('RECARGA');
  const [monto, setMonto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!asis || !monto) return;

    onSubmit({
      asistente_id: Number(asis),
      tipo,
      monto: Number(monto),
    });

    setMonto('');
  };

  return (
    <section>
      <h2>Nuevo movimiento</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="asis">ID de asistente</label>
        <input
          id="asis"
          type="number"
          min="1"
          step="1"
          required
          value={asis}
          onChange={(e) => setAsis(e.target.value)}
        />

        <label htmlFor="tipo">Tipo</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="RECARGA">RECARGA</option>
          <option value="CONSUMO">CONSUMO</option>
        </select>

        <label htmlFor="monto">Monto (COP)</label>
        <input
          id="monto"
          type="number"
          min="1"
          step="any"
          required
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <button type="submit">Registrar</button>
      </form>
    </section>
  );
}