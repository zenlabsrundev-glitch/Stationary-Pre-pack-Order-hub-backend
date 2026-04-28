import { IOrderRepository } from '../interfaces/IOrderRepository';
import { Order } from '../domain/order';

export class CreateOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderData: Partial<Order>): Promise<Order> {
    // Add business logic (e.g., validate stock, calculate total again)
    return this.orderRepository.create(orderData);
  }
}
