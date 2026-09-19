// Libraries
import { useEffect, useState } from 'react';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

// Interfaces
import type { Cliente } from '../../../interfaces';

// Repositories
import { clienteRepository } from '../../../respositories/cliente.repository';

// Styles
import '../pages.css';

const VACIO: Omit<Cliente, 'id'> = {
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  direccion: '',
  estado: true,
};

export function ClientesPage() {
  const { isAdmin } = useAuth();
  const { showToast, showConfirm } = useAlert();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<Omit<Cliente, 'id'>>(VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    try {
      setCargando(true);
      const data = await clienteRepository.getAll();
      setClientes(data);
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
        await clienteRepository.update(editandoId, form);
      } else {
        await clienteRepository.create(form);
      }
      setForm(VACIO);
      setEditandoId(null);
      await cargar();
      showToast('Guardado correctamente', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar', 'error');
    }
  }

  function handleEditar(c: Cliente) {
    const { id, ...rest } = c;
    setForm(rest);
    setEditandoId(id);
  }

  function handleEliminar(id: string) {
    showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Eliminar este cliente?',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await clienteRepository.remove(id);
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
        <h1>Clientes</h1>
        <p className="page__subtitle">
          Gestiona la base de clientes de la tienda
        </p>
      </header>

      {/* Formulario */}
      {isAdmin && (
        <section className="card">
        <h2 className="card__title">
          {editandoId ? 'Editar cliente' : 'Nuevo cliente'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nombre</span>
            <input
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre"
            />
          </label>

          <label className="field">
            <span>Apellido</span>
            <input
              required
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              placeholder="Apellido"
            />
          </label>

          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              required
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              placeholder="correo@ejemplo.com"
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
      )}

      {/* Listado */}
      <section className="card">
        <h2 className="card__title">Listado ({clientes.length})</h2>

        {cargando && <p className="muted">Cargando...</p>}

        {!cargando && clientes.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize: '2.5rem' }}>🧑‍🤝‍🧑</span>
            <p>No hay clientes registrados.</p>
          </div>
        )}

        {clientes.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>
                        {c.nombre} {c.apellido}
                      </strong>
                    </td>
                    <td>{c.correo}</td>
                    <td>{c.telefono || <span className="muted">—</span>}</td>
                    <td>{c.direccion || <span className="muted">—</span>}</td>
                    <td>
                      <span
                        className={
                          c.estado ? 'badge badge--ok' : 'badge badge--off'
                        }
                      >
                        {c.estado ? 'Activo' : 'Inactivo'}
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
