// Libraries
import { useEffect, useState } from 'react';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

// Interfaces
import type { Categoria } from '../../../interfaces';

// Repositories
import { categoriaRepository } from '../../../respositories/categoria.repository';

// Styles
import '../pages.css';

const VACIO: Omit<Categoria, 'id'> = {
  nombre: '',
  descripcion: '',
  estado: true,
};

export function CategoriasPage() {
  const { isAdmin } = useAuth();
  const { showToast, showConfirm } = useAlert();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Omit<Categoria, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setCargando(true);
      const data = await categoriaRepository.getAll();
      setCategorias(data);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al cargar', 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (editandoId) {
        await categoriaRepository.update(editandoId, form);
      } else {
        await categoriaRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
      showToast('Guardado correctamente', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar', 'error');
    }
  }

  function handleEditar(c: Categoria) {
    const { id, ...rest } = c;
    setForm(rest);
    setEditandoId(id);
  }

  function handleEliminar(id: string) {
    showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Eliminar esta categoría?',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await categoriaRepository.remove(id);
          await cargar();
          showToast('Registro eliminado exitosamente', 'success');
        } catch (e) {
          showToast(e instanceof Error ? e.message : 'Error al eliminar', 'error');
        }
      }
    });
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
      {isAdmin && (
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
      )}

      {/* Listado */}
      <section className="card">
        <h2 className="card__title">Listado ({categorias.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}

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
                        {isAdmin && (
                          <>
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
                    </>
                        )}
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
