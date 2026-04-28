import { IOrderRepository } from '../interfaces/IOrderRepository';
import { Order } from '../domain/order';

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: string, status: string): Promise<Order> {
    return this.orderRepository.updateStatus(orderId, status);
  }
}
