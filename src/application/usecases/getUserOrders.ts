import { IOrderRepository } from '../interfaces/IOrderRepository';
import { Order } from '../domain/order';

export class GetUserOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
