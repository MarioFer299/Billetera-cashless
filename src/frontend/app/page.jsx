'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import MovimientoForm from '@/components/MovimientoForm';
import BuscarForm from '@/components/BuscarForm';
import DetalleMovimiento from '@/components/DetalleMovimiento';
import TablaMovimientos from '@/components/TablaMovimientos';

// Utilidades
const money = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(n));

const fecha = (d) =>
  d
    ? new Date(d).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '—';

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [movimientos, setMovimientos] = useState([]);
  const [pagination, setPagination] = useState({});
  const [detalle, setDetalle] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });

  // Cargar API URL desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('api');
      if (saved) setBaseUrl(saved);
    } catch {}
  }, []);

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError });
  };

  const apiFetch = useCallback(
    async (path, opts = {}) => {
      let r;
      try {
        r = await fetch(baseUrl.replace(/\/$/, '') + path, {
          ...opts,
          headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
        });
      } catch {
        throw new Error('No se pudo conectar con la API en ' + baseUrl);
      }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
      return j;
    },
    [baseUrl]
  );

  const loadData = useCallback(async () => {
    try {
      const { data, pagination: p } = await apiFetch(
        `/api/movimientos?page=${page}&limit=${limit}`
      );
      setMovimientos(data);
      setPagination(p);
      return p;
    } catch (e) {
      showMsg(e.message, true);
    }
  }, [apiFetch, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveApi = (newUrl) => {
    const finalUrl = newUrl || 'http://localhost:3000';
    setBaseUrl(finalUrl);
    try {
      localStorage.setItem('api', finalUrl);
    } catch {}
    showMsg('');
    setPage(1);
  };

  const handleCrear = async (nuevoMovimiento) => {
    try {
      const { data } = await apiFetch('/api/movimientos', {
        method: 'POST',
        body: JSON.stringify(nuevoMovimiento),
      });
      showMsg(
        `Movimiento #${data.id} registrado. Saldo actual del asistente: ${money(data.saldo)}`
      );

      setPage(1);
      const p = await loadData();
      if (p && p.totalPages > 1) {
        setPage(p.totalPages);
      }
      setDetalle(data);
    } catch (err) {
      showMsg(err.message, true);
    }
  };

  const handleBuscar = async (id) => {
    try {
      showMsg('');
      const res = await apiFetch('/api/movimientos/' + id);
      setDetalle(res.data);
    } catch (e) {
      setDetalle(null);
      showMsg(e.message, true);
    }
  };

  const handleRowClick = (id) => {
    setSearchId(String(id));
    handleBuscar(id);
  };

  return (
    <>
      <Header baseUrl={baseUrl} onSaveApi={handleSaveApi} />

      <div className="wrap">
        {message.text && (
          <div className={`msg ${message.isError ? 'err' : ''}`}>
            {message.text}
          </div>
        )}

        <main>
          <aside>
            <MovimientoForm onSubmit={handleCrear} />
            <section>
              <h2>Consultar por ID</h2>
              <BuscarForm
                onSearch={handleBuscar}
                searchId={searchId}
                setSearchId={setSearchId}
              />
              <DetalleMovimiento
                detalle={detalle}
                moneyFormatter={money}
                dateFormatter={fecha}
              />
            </section>
          </aside>

          <TablaMovimientos
            movimientos={movimientos}
            pagination={pagination}
            page={page}
            limit={limit}
            moneyFormatter={money}
            dateFormatter={fecha}
            onRowClick={handleRowClick}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </main>
      </div>
    </>
  );
}