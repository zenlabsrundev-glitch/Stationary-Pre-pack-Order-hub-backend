import { IOrderRepository } from '../interfaces/IOrderRepository';
import { Order } from '../domain/order';

export class GetAllOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
