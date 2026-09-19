// Services
import { api } from '../services/api.service';

// Interfaces
import type { EstadoOrden } from '../interfaces';

const RESOURCE = '/estado_orden';

export const estadoOrdenRepository = {
  getAll: async (): Promise<EstadoOrden[]> => {
    return (await api.get(RESOURCE)) as EstadoOrden[];
  },
  getById: async (id: string): Promise<EstadoOrden> => {
    return (await api.get(`${RESOURCE}/${id}`)) as EstadoOrden;
  },
  create: async (data: Omit<EstadoOrden, 'id'>): Promise<EstadoOrden> => {
    return (await api.post(RESOURCE, data)) as EstadoOrden;
  },
  update: async (
    id: string,
    data: Partial<EstadoOrden>,
  ): Promise<EstadoOrden> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as EstadoOrden;
  },
  remove: async (id: string): Promise<EstadoOrden> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as EstadoOrden;
  },
};
