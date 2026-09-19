// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { Categoria } from '../../../interfaces';

// Repositories
import { categoriaRepository } from '../../../respositories/categoria.repository';

// Styles
import '../productos/productos.css';

const VACIO: Omit<Categoria, 'id'> = {
  nombre: '',
  descripcion: '',
  estado: true,
};

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Omit<Categoria, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      const data = await categoriaRepository.getAll();
      setCategorias(data);
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
        await categoriaRepository.update(editandoId, form);
      } else {
        await categoriaRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    }
  }

  function handleEditar(c: Categoria) {
    const { id, ...rest } = c;
    setForm(rest);
    setEditandoId(id);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoriaRepository.remove(id);
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
        <h1>Categorías</h1>
        <p className="page__subtitle">
          Organiza los grupos de productos de la tienda
        </p>
      </header>

      {/* Formulario */}
      <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar categoría' : 'Nueva categoría'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Camisetas"
            />
          </label>

          <label className="field">
            <span>Descripción</span>
            <input
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Breve descripción"
            />
          </label>

          <label className="field field--check">
            <input
              type="checkbox"
              checked={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.checked })}
            />
            <span>Activa</span>
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
        <h2 className="card__title">Listado ({categorias.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!cargando && categorias.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>🏷️</span>
            <p>Aún no hay categorías creadas.</p>
          </div>
        )}

        {categorias.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.nombre}</strong>
                    </td>
                    <td>{c.descripcion || <span className="muted">—</span>}</td>
                    <td>
                      <span
                        className={
                          c.estado ? 'badge badge--ok' : 'badge badge--off'
                        }
                      >
                        {c.estado ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="table__actions">
                      <button
                        className="btn btn--sm"
                        onClick={() => handleEditar(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleEliminar(c.id)}
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
