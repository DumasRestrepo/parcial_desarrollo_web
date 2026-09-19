// Libraries
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Context
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

// Styles
import './auth.css';

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useAlert();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    clave: '',
  });

  const { nombre, clave } = formData;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim() || !clave.trim()) {
      showToast('Por favor, ingresa tu usuario y contraseña', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await login(nombre, clave);
      if (success) {
        showToast(`Bienvenido de vuelta, ${nombre}`, 'success');
        navigate('/');
      } else {
        showToast('Credenciales inválidas', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">U</div>
          <h1 className="auth-title">Bienvenido de nuevo</h1>
          <p className="auth-subtitle">Ingresa a tu panel de Unholy Store</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <span>Usuario</span>
            <input
              type="text"
              name="nombre"
              placeholder="Ej. admin"
              value={nombre}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="clave"
              placeholder="••••••••"
              value={clave}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes una cuenta?
          <Link to="/register" className="auth-link">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
