import { api } from '../services/api.service';

export class BaseRepository<T extends { id: string }> {
  private resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  getAll(): Promise<T[]> {
    return api.get(`/${this.resource}`) as Promise<T[]>;
  }

  getById(id: string): Promise<T> {
    return api.get(`/${this.resource}/${id}`) as Promise<T>;
  }

  create(data: Omit<T, 'id'>): Promise<T> {
    return api.post(`/${this.resource}`, data) as Promise<T>;
  }

  update(id: string, data: Partial<T>): Promise<T> {
    return api.put(`/${this.resource}/${id}`, data) as Promise<T>;
  }

  remove(id: string): Promise<T> {
    return api.delete(`/${this.resource}/${id}`) as Promise<T>;
  }
}
