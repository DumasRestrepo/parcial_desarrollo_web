// Libraries
import { useEffect, useState } from 'react';

// Interfaces
import type { Usuario } from '../../../interfaces';
import { useAlert } from '../../../context/AlertContext';
import { useAuth } from '../../../context/AuthContext';

// Repositories
import { usuarioRepository } from '../../../respositories/usuario.repository';

// Styles
import '../pages.css';

const VACIO: Omit<Usuario, 'id'> = {
  nombre: '',
  clave: '',
  estado: true,
  rol: 'USER',
};

export function UsuariosPage() {
  const { user } = useAuth();
  const { showToast, showConfirm } = useAlert();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Omit<Usuario, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setCargando(true);
      const data = await usuarioRepository.getAll();
      setUsuarios(data);
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
        await usuarioRepository.update(editandoId, form);
      } else {
        await usuarioRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
      showToast('Guardado correctamente', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar', 'error');
    }
  }

  function handleEditar(u: Usuario) {
    const { id, ...rest } = u;
    // Si no tiene rol, asumimos que es ADMIN (retrocompatibilidad) o USER según se prefiera, pero dejémoslo explícito
    setForm({ ...rest, rol: rest.rol || 'USER' });
    setEditandoId(id);
  }

  function handleEliminar(id: string) {
    showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Eliminar este usuario?',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await usuarioRepository.remove(id);
          await cargar();
          showToast('Registro eliminado exitosamente', 'success');
        } catch (e) {
          showToast(
            e instanceof Error ? e.message : 'Error al eliminar',
            'error',
          );
        }
      },
    });
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

          <label className="field">
            <span>Rol</span>
            <select
              value={form.rol || 'USER'}
              disabled={editandoId === user?.id}
              onChange={(e) =>
                setForm({ ...form, rol: e.target.value as 'ADMIN' | 'USER' })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                opacity: editandoId === user?.id ? 0.6 : 1,
              }}
            >
              <option value="USER">Vendedor (USER)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
            </select>
          </label>

          <label className="field field--check">
            <input
              type="checkbox"
              disabled={editandoId === user?.id}
              checked={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.checked })}
            />
            <span style={{ opacity: editandoId === user?.id ? 0.6 : 1 }}>
              Activo
            </span>
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
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const isCurrentUser = user?.id === u.id;
                  return (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.nombre}</strong>{' '}
                        {isCurrentUser && (
                          <span
                            className="muted"
                            style={{ fontSize: '0.8rem' }}
                          >
                            (Tú)
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background:
                              u.rol === 'ADMIN'
                                ? 'var(--color-primary)'
                                : 'var(--color-border)',
                            color:
                              u.rol === 'ADMIN' ? 'white' : 'var(--color-text)',
                          }}
                        >
                          {u.rol || 'ADMIN'}
                        </span>
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
                        {!isCurrentUser && (
                          <button
                            className="btn btn--sm btn--danger"
                            onClick={() => handleEliminar(u.id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
