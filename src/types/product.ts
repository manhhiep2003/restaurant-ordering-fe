export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  isAvailable: boolean;
}

export type ProductPayload = Omit<Product, 'id'>;