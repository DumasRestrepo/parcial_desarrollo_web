// Libraries
import { useState, useEffect } from 'react';

// Context
import { useCart } from '../../context/CartContext';

// Repositories
import { clienteRepository } from '../../respositories/cliente.repository';
import { ordenRepository } from '../../respositories/orden.repository';

// Interfaces
import type { Cliente } from '../../interfaces';

// Utils
import { getProductFallbackImage } from '../../utils/productImage';

// Styles
import './cart.css';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCartOpen && clientes.length === 0) {
      clienteRepository
        .getAll()
        .then((data) => {
          setClientes(data);
          if (data.length > 0) setSelectedClienteId(data[0].id);
        })
        .catch(console.error);
    }
  }, [isCartOpen, clientes.length]);

  const handleCheckout = async () => {
    if (!selectedClienteId || cart.length === 0) return;
    setLoading(true);

    try {
      const clienteInfo = clientes.find((c) => c.id === selectedClienteId);
      const clienteNombre = clienteInfo
        ? clienteInfo.nombre
        : 'Cliente Desconocido';

      const detalle = cart
        .map((item) => `${item.quantity}x ${item.producto.nombre}`)
        .join(', ');

      await ordenRepository.create({
        cliente: clienteNombre,
        fecha: new Date().toISOString().split('T')[0],
        metodo_pago: 'Tarjeta',
        total: cartTotal,
        descuento: 0,
        detalle: detalle,
        estado_orden: 'Pendiente',
      });

      alert('¡Orden creada exitosamente!');
      clearCart();
      toggleCart();
    } catch (error) {
      alert('Error al crear la orden');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`cart-overlay ${isCartOpen ? 'is-open' : ''}`}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cart-close-btn" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛍️</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => {
              const fallback = getProductFallbackImage(
                item.producto.nombre,
                item.producto.categoria,
              );
              return (
                <div key={item.producto.id} className="cart-item">
                  <img
                    src={item.producto.imagen || fallback}
                    alt={item.producto.nombre}
                    className="cart-item-img"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== fallback) img.src = fallback;
                    }}
                  />
                  <div className="cart-item-info">
                    <span className="cart-item-title">
                      {item.producto.nombre}
                    </span>
                    <span className="cart-item-price">
                      ${item.producto.precio.toFixed(2)} c/u
                    </span>
                    <div className="cart-item-controls">
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.producto.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.producto.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-checkout-form">
              <label
                htmlFor="cliente-select"
                style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}
              >
                Cliente para la orden:
              </label>
              <select
                id="cliente-select"
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Seleccione un cliente...
                </option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="cart-total-row">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={loading || !selectedClienteId}
            >
              {loading ? 'Procesando...' : 'Crear Orden'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
