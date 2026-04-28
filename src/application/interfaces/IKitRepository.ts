import { Kit } from '../domain/kit';

export interface IKitRepository {
  findAll(): Promise<Kit[]>;
  findById(id: string): Promise<Kit | null>;
  create(kit: Partial<Kit>): Promise<Kit>;
  update(id: string, kit: Partial<Kit>): Promise<Kit>;
  delete(id: string): Promise<boolean>;
}
