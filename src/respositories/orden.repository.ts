// Services
import { api } from '../services/api.service';

// Interfaces
import type { Orden } from '../interfaces';

const RESOURCE = '/orden';

export const ordenRepository = {
  getAll: async (): Promise<Orden[]> => {
    return (await api.get(RESOURCE)) as Orden[];
  },
  getById: async (id: string): Promise<Orden> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Orden;
  },
  create: async (data: Omit<Orden, 'id'>): Promise<Orden> => {
    return (await api.post(RESOURCE, data)) as Orden;
  },
  update: async (id: string, data: Partial<Orden>): Promise<Orden> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Orden;
  },
  remove: async (id: string): Promise<Orden> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Orden;
  },
};
