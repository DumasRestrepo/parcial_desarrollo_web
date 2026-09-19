// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { Usuario } from '../../../interfaces';

// Repositories
import { usuarioRepository } from '../../../respositories/usuario.repository';

// Styles
import '../pages.css';

const VACIO: Omit<Usuario, 'id'> = {
  nombre: '',
  clave: '',
  estado: true,
};

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Omit<Usuario, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      const data = await usuarioRepository.getAll();
      setUsuarios(data);
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
        await usuarioRepository.update(editandoId, form);
      } else {
        await usuarioRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    }
  }

  function handleEditar(u: Usuario) {
    const { id, ...rest } = u;
    setForm(rest);
    setEditandoId(id);
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await usuarioRepository.remove(id);
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
        <h1>Usuarios</h1>
        <p className="page__subtitle">Administra los usuarios del sistema</p>
      </header>

      {/* Formulario */}
      <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar usuario' : 'Nuevo usuario'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre de usuario"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              required={!editandoId}
              value={form.clave}
              onChange={(e) => setForm({ ...form, clave: e.target.value })}
              placeholder={
                editandoId ? 'Dejar vacío para no cambiar' : 'Contraseña'
              }
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
        <h2 className="card__title">Listado ({usuarios.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!cargando && usuarios.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>👤</span>
            <p>No hay usuarios registrados.</p>
          </div>
        )}

        {usuarios.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.nombre}</strong>
                    </td>
                    <td>
                      <span
                        className={
                          u.estado ? 'badge badge--ok' : 'badge badge--off'
                        }
                      >
                        {u.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="table__actions">
                      <button
                        className="btn btn--sm"
                        onClick={() => handleEditar(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleEliminar(u.id)}
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
