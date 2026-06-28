export interface OrderItemPayload {
  productId: string;
  quantity: number;
  note?: string;
}

export interface CreateOrderPayload {
  tableId: string;
  items: OrderItemPayload[];
}