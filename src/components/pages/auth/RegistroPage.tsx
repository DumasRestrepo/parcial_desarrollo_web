// Libraries
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

// Styles
import './auth.css';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useAlert();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !clave.trim() || !confirmarClave.trim()) {
      showToast('Por favor, completa todos los campos', 'error');
      return;
    }

    if (clave !== confirmarClave) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (clave.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await register(nombre, clave);
      if (success) {
        showToast('Cuenta creada exitosamente', 'success');
        navigate('/');
      }
    } catch (err: any) {
      showToast(err.message || 'Error al registrar el usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">U</div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete al equipo de Unholy Store</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <span>Usuario</span>
            <input
              type="text"
              placeholder="Ej. nuevo_admin"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="••••••••"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Confirmar Contraseña</span>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
