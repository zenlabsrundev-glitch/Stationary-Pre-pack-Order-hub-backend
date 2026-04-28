import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../application/usecases/createOrder';

export class OrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body;
      const order = await this.createOrderUseCase.execute(orderData);
      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response, updateStatusUseCase: any) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await updateStatusUseCase.execute(id, status);
      return res.json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response, getAllOrdersUseCase: any) {
    try {
      const orders = await getAllOrdersUseCase.execute();
      return res.json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserOrders(req: Request, res: Response, getUserOrdersUseCase: any) {
    try {
      const { userId } = req.params;
      const orders = await getUserOrdersUseCase.execute(userId);
      return res.json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
