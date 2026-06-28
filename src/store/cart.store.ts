import type { Product } from '@/types/product';
import { create } from 'zustand';

// Định nghĩa 1 món trong giỏ hàng (Kế thừa Product nhưng có thêm số lượng và ghi chú)
export interface CartItem extends Product {
  quantity: number;
  note?: string;
}

interface CartState {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  addItem: (product: Product, note?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (product, note = '') => {
    const { cart } = get();
    // Kiểm tra xem món này (và cùng ghi chú) đã có trong giỏ chưa
    const existingItem = cart.find((item) => item.id === product.id && item.note === note);

    let newCart;
    if (existingItem) {
      // Nếu có rồi thì chỉ tăng số lượng
      newCart = cart.map((item) =>
        item.id === product.id && item.note === note
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Nếu chưa có thì thêm mới vào mảng với quantity = 1
      newCart = [...cart, { ...product, quantity: 1, note }];
    }
    
    // Cập nhật lại toàn bộ store
    set({
      cart: newCart,
      totalItems: newCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newCart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    });
  },

  removeItem: (productId) => {
    const { cart } = get();
    const newCart = cart.filter((item) => item.id !== productId);
    set({
      cart: newCart,
      totalItems: newCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newCart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    });
  },

  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    if (quantity <= 0) return; // Không cho giảm xuống âm

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({
      cart: newCart,
      totalItems: newCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: newCart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    });
  },

  clearCart: () => set({ cart: [], totalItems: 0, totalPrice: 0 }),
}));