// Libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import { Layout } from './components/layout/Layout';
import { HomePage } from './components/pages/ HomePage';
import { ProductosPage } from './components/pages/productos/ProductosPage';
import { CategoriasPage } from './components/pages/categorias/CategoriasPage';
import { UsuariosPage } from './components/pages/usuarios/ UsuariosPages';
import { ClientesPage } from './components/pages/clientes/ClientesPage';
import { OrdenesPage } from './components/pages/ordenes/OrdenesPage';
import { EstadosOrdenPage } from './components/pages/estadosOrdenes/EstadosOrdenes';
import { InformacionPage } from './components/pages/informacion/InformacionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
          <Route path="/estados-orden" element={<EstadosOrdenPage />} />
          <Route path="/informacion" element={<InformacionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
