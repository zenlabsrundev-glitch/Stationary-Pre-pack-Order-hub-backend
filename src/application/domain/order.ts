export type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Delivered';

export interface OrderItem {
  id: string;
  kitId: string;
  kitName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'Online';
  transactionId?: string;
  address?: string;
  phoneNumber?: string;
  location?: { lat: number; lng: number };
  orderDate: string;
  createdAt: string;
}
