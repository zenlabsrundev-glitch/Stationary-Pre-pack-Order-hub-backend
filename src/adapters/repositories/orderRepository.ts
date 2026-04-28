import { IOrderRepository } from '../../application/interfaces/IOrderRepository';
import { Order } from '../../application/domain/order';
import { supabase } from '../../infrastructure/supabaseClient';

export class OrderRepository implements IOrderRepository {
  async findAll(): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw new Error(error.message);
    return data as Order[];
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase.from('orders').select('*').eq('userId', userId);
    if (error) throw new Error(error.message);
    return data as Order[];
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as Order;
  }

  async create(order: Partial<Order>): Promise<Order> {
    // Get count of existing orders to generate sequential ID
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const nextNum = String((count || 0) + 1).padStart(3, '0');
    const orderId = `ORD-${nextNum}`;

    console.log('--- CREATING ORDER ---');
    console.log('Current Count:', count);
    console.log('Generated ID:', orderId);

    const { data, error } = await supabase.from('orders').insert([{
      ...order,
      id: orderId,
      createdAt: new Date().toISOString(),
      orderDate: new Date().toLocaleDateString()
    }]).select().single();
    
    if (error) throw new Error(error.message);
    return data as Order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as Order;
  }
}
