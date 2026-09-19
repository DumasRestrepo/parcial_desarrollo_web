// Services
import { api } from '../services/api.service';

// Interfaces
import type { Producto } from '../interfaces';

const RESOURCE = '/producto';

export const productoRepository = {
  getAll: async (): Promise<Producto[]> => {
    return (await api.get(RESOURCE)) as Producto[];
  },
  getById: async (id: string): Promise<Producto> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Producto;
  },
  create: async (data: Omit<Producto, 'id'>): Promise<Producto> => {
    return (await api.post(RESOURCE, data)) as Producto;
  },
  update: async (id: string, data: Partial<Producto>): Promise<Producto> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Producto;
  },
  remove: async (id: string): Promise<Producto> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Producto;
  },
};
