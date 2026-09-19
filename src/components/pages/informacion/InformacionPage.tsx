// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { Information } from '../../../interfaces';

// Repositories
import { informationRepository } from '../../../respositories/information.repository';

// Styles
import '../pages.css';

const VACIO: Omit<Information, 'id'> = {
  nombre: '',
  telefono: '',
  direccion: '',
  horario: '',
};

export function InformacionPage() {
  const [registros, setRegistros] = useState<Information[]>([]);
  const [form, setForm] = useState<Omit<Information, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      const data = await informationRepository.getAll();
      setRegistros(data);
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
        await informationRepository.update(editandoId, form);
      } else {
        await informationRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    }
  }

  function handleEditar(info: Information) {
    const { id, ...rest } = info;
    setForm(rest);
    setEditandoId(id);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este registro?')) return;
    try {
      await informationRepository.remove(id);
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
        <h1>Información</h1>
        <p className="page__subtitle">
          Datos de contacto y horarios de la tienda
        </p>
      </header>

      {/* Tarjetas de info actuales */}
      {!cargando && registros.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {registros.map((info) => (
            <div
              key={info.id}
              className="card"
              style={{
                marginBottom: 0,
                borderLeft: '4px solid var(--color-secondary)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'var(--color-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                {info.nombre}
              </p>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-muted)',
                  marginBottom: '0.3rem',
                }}
              >
                📞 {info.telefono || '—'}
              </p>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-muted)',
                  marginBottom: '0.3rem',
                }}
              >
                📍 {info.direccion || '—'}
              </p>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                🕐 {info.horario || '—'}
              </p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="btn btn--sm"
                  onClick={() => handleEditar(info)}
                >
                  Editar
                </button>
                <button
                  className="btn btn--sm btn--danger"
                  onClick={() => handleEliminar(info.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario */}
      <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar información' : 'Agregar información'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre de la tienda</span>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Unholy Store"
            />
          </label>

          <label className="field">
            <span>Teléfono</span>
            <input
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="+57 300 000 0000"
            />
          </label>

          <label className="field">
            <span>Dirección</span>
            <input
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Calle, ciudad"
            />
          </label>

          <label className="field">
            <span>Horario</span>
            <input
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              placeholder="Lun - Sáb: 9am - 7pm"
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              {editandoId ? 'Actualizar' : 'Guardar'}
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

      {cargando && <p className="muted">Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && registros.length === 0 && (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>ℹ️</span>
          <p>No hay información registrada. Agrega los datos de la tienda.</p>
        </div>
      )}
    </div>
  );
}
