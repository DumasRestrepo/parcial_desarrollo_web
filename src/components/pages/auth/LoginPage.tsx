// Libraries
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Context
import { useAuth } from '../../../context/AuthContext';

// Styles
import './auth.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    clave: '',
    error: '',
  });

  const { nombre, clave, error } = formData;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, error: '' }));

    if (!nombre.trim() || !clave.trim()) {
      setFormData((prev) => ({
        ...prev,
        error: 'Por favor, ingresa tu usuario y contraseña',
      }));
      return;
    }

    setLoading(true);
    try {
      const success = await login(nombre, clave);
      if (success) {
        navigate('/');
      } else {
        setFormData((prev) => ({ ...prev, error: 'Credenciales inválidas' }));
      }
    } catch (err: any) {
      setFormData((prev) => ({
        ...prev,
        error: err.message || 'Error al iniciar sesión',
      }));
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

        {error && <div className="auth-error">{error}</div>}

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
