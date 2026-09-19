// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { EstadoOrden } from '../../../interfaces';

// Repositories
import { estadoOrdenRepository } from '../../../respositories/estadoOrden.repository';

// Styles
import '../pages.css';

const VACIO: Omit<EstadoOrden, 'id'> = {
  nombre: '',
  descripcion: '',
  color: '#6366f1',
  estado: true,
};

export function EstadosOrdenPage() {
  const [estados, setEstados] = useState<EstadoOrden[]>([]);
  const [form, setForm] = useState<Omit<EstadoOrden, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      const data = await estadoOrdenRepository.getAll();
      setEstados(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      if (editandoId) {
        await estadoOrdenRepository.update(editandoId, form);
      } else {
        await estadoOrdenRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    }
  }

  function handleEditar(es: EstadoOrden) {
    const { id, ...rest } = es;
    setForm(rest);
    setEditandoId(id);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este estado?')) return;
    try {
      await estadoOrdenRepository.remove(id);
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
        <h1>Estados de Orden</h1>
        <p className="page__subtitle">
          Define los posibles estados del ciclo de vida de un pedido
        </p>
      </header>

      {/* Formulario */}
      <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar estado' : 'Nuevo estado'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Pendiente, Enviado, Entregado"
            />
          </label>

          <label className="field">
            <span>Descripción</span>
            <input
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Breve descripción del estado"
            />
          </label>

          <label className="field">
            <span>Color</span>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              style={{ height: '42px', cursor: 'pointer', padding: '2px 4px' }}
            />
          </label>

          <label className="field field--check">
            <input
              type="checkbox"
              checked={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.checked })}
            />
            <span>Activo</span>
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
        <h2 className="card__title">Listado ({estados.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!cargando && estados.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>🔖</span>
            <p>No hay estados de orden definidos.</p>
          </div>
        )}

        {estados.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estados.map((es) => (
                  <tr key={es.id}>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: es.color || '#ccc',
                          border: '2px solid rgba(0,0,0,0.1)',
                          verticalAlign: 'middle',
                        }}
                      />
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${es.color}22`,
                          color: es.color,
                          border: `1px solid ${es.color}55`,
                        }}
                      >
                        {es.nombre}
                      </span>
                    </td>
                    <td>
                      {es.descripcion || <span className="muted">—</span>}
                    </td>
                    <td>
                      <span
                        className={
                          es.estado ? 'badge badge--ok' : 'badge badge--off'
                        }
                      >
                        {es.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="table__actions">
                      <button
                        className="btn btn--sm"
                        onClick={() => handleEditar(es)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleEliminar(es.id)}
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
