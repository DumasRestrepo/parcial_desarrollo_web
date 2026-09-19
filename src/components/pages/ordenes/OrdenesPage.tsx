// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { Orden } from '../../../interfaces';

// Repositories
import { ordenRepository } from '../../../respositories/orden.repository';

// Styles
import '../productos/productos.css';

const today = new Date().toISOString().slice(0, 10);

const VACIO: Omit<Orden, 'id'> = {
  cliente: '',
  fecha: today,
  metodo_pago: '',
  total: 0,
  descuento: 0,
  detalle: '',
  estado_orden: '',
};

export function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [form, setForm] = useState<Omit<Orden, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      const data = await ordenRepository.getAll();
      setOrdenes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editandoId) {
        await ordenRepository.update(editandoId, form);
      } else {
        await ordenRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    }
  }

  function handleEditar(o: Orden) {
    const { id, ...rest } = o;
    setForm(rest);
    setEditandoId(id);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta orden?')) return;
    try {
      await ordenRepository.remove(id);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }

  function handleCancelar() {
    setForm(VACIO);
    setEditandoId(null);
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>Órdenes</h1>
        <p className="page__subtitle">Seguimiento y gestión de pedidos</p>
      </header>

      {/* Formulario */}
      <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar orden' : 'Nueva orden'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Cliente</span>
            <input
              required
              value={form.cliente}
              onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              placeholder="Nombre del cliente"
            />
          </label>

          <label className="field">
            <span>Fecha</span>
            <input
              type="date"
              required
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Método de pago</span>
            <input
              required
              value={form.metodo_pago}
              onChange={(e) =>
                setForm({ ...form, metodo_pago: e.target.value })
              }
              placeholder="Ej. Tarjeta, Efectivo"
            />
          </label>

          <label className="field">
            <span>Total ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.total}
              onChange={(e) =>
                setForm({ ...form, total: Number(e.target.value) })
              }
            />
          </label>

          <label className="field">
            <span>Descuento ($)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.descuento}
              onChange={(e) =>
                setForm({ ...form, descuento: Number(e.target.value) })
              }
            />
          </label>

          <label className="field">
            <span>Estado de orden</span>
            <input
              value={form.estado_orden}
              onChange={(e) =>
                setForm({ ...form, estado_orden: e.target.value })
              }
              placeholder="Ej. Pendiente, Enviado"
            />
          </label>

          <label className="field" style={{ gridColumn: '1 / -1' }}>
            <span>Detalle</span>
            <input
              value={form.detalle}
              onChange={(e) => setForm({ ...form, detalle: e.target.value })}
              placeholder="Descripción del pedido"
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              {editandoId ? 'Actualizar' : 'Crear'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Listado */}
      <section className="card">
        <h2 className="card__title">Listado ({ordenes.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!cargando && ordenes.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>🛒</span>
            <p>No hay órdenes registradas.</p>
          </div>
        )}

        {ordenes.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Método pago</th>
                  <th>Total</th>
                  <th>Descuento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.cliente}</strong>
                    </td>
                    <td>{o.fecha}</td>
                    <td>{o.metodo_pago || <span className="muted">—</span>}</td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td>${Number(o.descuento).toFixed(2)}</td>
                    <td>
                      {o.estado_orden ? (
                        <span className="badge badge--warn">
                          {o.estado_orden}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="table__actions">
                      <button
                        className="btn btn--sm"
                        onClick={() => handleEditar(o)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleEliminar(o.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
