// Services
import { api } from '../services/api.service';

// Interfaces
import type { Cliente } from '../interfaces';

const RESOURCE = '/cliente';

export const clienteRepository = {
  getAll: async (): Promise<Cliente[]> => {
    return (await api.get(RESOURCE)) as Cliente[];
  },
  getById: async (id: string): Promise<Cliente> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Cliente;
  },
  create: async (data: Omit<Cliente, 'id'>): Promise<Cliente> => {
    return (await api.post(RESOURCE, data)) as Cliente;
  },
  update: async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Cliente;
  },
  remove: async (id: string): Promise<Cliente> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Cliente;
  },
};
