// Services
import { api } from '../services/api.service';

// Interfaces
import type { Information } from '../interfaces';

const RESOURCE = '/information';

export const informationRepository = {
  getAll: async (): Promise<Information[]> => {
    return (await api.get(RESOURCE)) as Information[];
  },
  getById: async (id: string): Promise<Information> => {
    return (await api.get(`${RESOURCE}/${id}`)) as Information;
  },
  create: async (data: Omit<Information, 'id'>): Promise<Information> => {
    return (await api.post(RESOURCE, data)) as Information;
  },
  update: async (
    id: string,
    data: Partial<Information>,
  ): Promise<Information> => {
    return (await api.put(`${RESOURCE}/${id}`, data)) as Information;
  },
  remove: async (id: string): Promise<Information> => {
    return (await api.delete(`${RESOURCE}/${id}`)) as Information;
  },
};
