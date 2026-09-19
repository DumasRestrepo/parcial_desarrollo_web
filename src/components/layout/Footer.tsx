// Libraries
import { Link } from 'react-router-dom';

// Styles
import './layout.css';

const col1 = [
  { to: '/productos', label: 'Productos' },
  { to: '/categorias', label: 'Categorías' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/ordenes', label: 'Órdenes' },
];

const col2 = [
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/estados-orden', label: 'Estados de Orden' },
  { to: '/informacion', label: 'Información' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__body container">
        {/* Marca */}
        <div className="ft__brand">
          <div className="ft__logo-row">
            <span className="ft__logo">U</span>
            <span className="ft__name">Unholy Store</span>
          </div>
          <p className="ft__desc">
            Moda urbana con identidad propia.
            <br />
            Ropa diseñada para quienes se atreven.
          </p>
          <span className="ft__tag">Moda Urbana · Colombia</span>
        </div>

        {/* Tienda */}
        <div className="ft__col">
          <p className="ft__heading">Tienda</p>
          <ul className="ft__list">
            {col1.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="ft__lnk">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin */}
        <div className="ft__col">
          <p className="ft__heading">Administración</p>
          <ul className="ft__list">
            {col2.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="ft__lnk">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="ft__col">
          <p className="ft__heading">Contacto</p>
          <ul className="ft__list">
            <li className="ft__contact">
              <span className="ft__ci">📞</span>
              <span className="ft__ct">+57 300 123 4567</span>
            </li>
            <li className="ft__contact">
              <span className="ft__ci">📍</span>
              <span className="ft__ct">Calle 123 #45-67, Medellín</span>
            </li>
            <li className="ft__contact">
              <span className="ft__ci">🕐</span>
              <span className="ft__ct">Lun – Sáb: 9am – 7pm</span>
            </li>
            <li className="ft__contact">
              <span className="ft__ci">🌞</span>
              <span className="ft__ct">Dom: 10am – 4pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="ft__bar container">
        <p className="ft__copy">
          © {year} Unholy Store. Todos los derechos reservados.
        </p>
        <div className="ft__legal">
          <a href="#" className="ft__legal-lnk">
            Privacidad
          </a>
          <a href="#" className="ft__legal-lnk">
            Términos
          </a>
          <a href="#" className="ft__legal-lnk">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}
