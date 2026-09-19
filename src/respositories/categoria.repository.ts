// Service
import { api } from '../services/api.service';

// Interfaces
import type { Categoria } from '../interfaces';

const RESOURCE = '/categoria';

export const categoriaRepository = {
  getAll: async (): Promise<Categoria[]> => {
    return (await api.get(RESOURCE)) as Categoria[];
  },
  getById: async (id: string): Promise<Categoria> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Categoria;
  },
  create: async (data: Omit<Categoria, 'id'>): Promise<Categoria> => {
    return (await api.post(RESOURCE, data)) as Categoria;
  },
  update: async (id: string, data: Partial<Categoria>): Promise<Categoria> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Categoria;
  },
  remove: async (id: string): Promise<Categoria> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Categoria;
  },
};
