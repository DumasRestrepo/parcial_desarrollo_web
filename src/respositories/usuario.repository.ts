// Services
import { api } from '../services/api.service';

// Interfaces
import type { Usuario } from '../interfaces';

const RESOURCE = '/usuario';

export const usuarioRepository = {
  getAll: async (): Promise<Usuario[]> => {
    return (await api.get(RESOURCE)) as Usuario[];
  },
  getById: async (id: string): Promise<Usuario> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Usuario;
  },
  create: async (data: Omit<Usuario, 'id'>): Promise<Usuario> => {
    return (await api.post(RESOURCE, data)) as Usuario;
  },
  update: async (id: string, data: Partial<Usuario>): Promise<Usuario> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Usuario;
  },
  remove: async (id: string): Promise<Usuario> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Usuario;
  },
};
