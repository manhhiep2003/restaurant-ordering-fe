export interface OrderItemPayload {
  productId: string;
  quantity: number;
  note?: string;
}

export interface CreateOrderPayload {
  tableId: string;
  items: OrderItemPayload[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  note: string | null;
  product: { name: string };
}

export interface Order {
  id: string;
  status: 'PENDING' | 'COOKING' | 'SERVED' | 'PAID' | 'CANCELLED';
  table: { name: string };
  createdAt: string;
  orderItems: OrderItem[];
}