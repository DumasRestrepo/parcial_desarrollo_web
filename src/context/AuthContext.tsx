// Libraries
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Repositories
import { usuarioRepository } from '../respositories/usuario.repository';

// Interfaces
import type { Usuario } from '../interfaces';

interface AuthContextType {
  user: Usuario | null;
  login: (nombre: string, clave: string) => Promise<boolean>;
  register: (nombre: string, clave: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('unholy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (nombre: string, clave: string) => {
    try {
      const users = await usuarioRepository.getAll();
      const found = users.find(
        (u) =>
          u.nombre.toLowerCase() === nombre.toLowerCase() && u.clave === clave,
      );

      if (found) {
        if (!found.estado) {
          throw new Error('Usuario inactivo');
        }
        setUser(found);
        localStorage.setItem('unholy_user', JSON.stringify(found));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (nombre: string, clave: string) => {
    try {
      const users = await usuarioRepository.getAll();
      const exists = users.find(
        (u) => u.nombre.toLowerCase() === nombre.toLowerCase(),
      );

      if (exists) {
        throw new Error('El usuario ya existe');
      }

      const newUser = await usuarioRepository.create({
        nombre,
        clave,
        estado: true,
        rol: 'USER',
      });

      setUser(newUser);
      localStorage.setItem('unholy_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unholy_user');
  };

  const isAdmin = user ? (user.rol === 'USER' ? false : true) : false;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAdmin }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
