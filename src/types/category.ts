export interface Category {
  id: string;
  name: string;
}

export type CategoryPayload = Omit<Category, 'id'>;