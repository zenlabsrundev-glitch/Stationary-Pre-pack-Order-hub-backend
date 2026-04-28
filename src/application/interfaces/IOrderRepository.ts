import { Order } from '../domain/order';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Partial<Order>): Promise<Order>;
  updateStatus(id: string, status: string): Promise<Order>;
}
