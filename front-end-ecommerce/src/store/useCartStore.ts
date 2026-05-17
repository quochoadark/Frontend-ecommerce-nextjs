import { create } from 'zustand';
import * as cartService from '../services/cart.service';

interface CartState {
  cart: cartService.CartResponse | null;
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isOpen: false,
  
  setIsOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ cart });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.addToCart(productId, quantity);
      set({ cart, isOpen: true }); // Open cart drawer on add
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.updateCartItem(itemId, quantity);
      set({ cart });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.removeCartItem(itemId);
      set({ cart });
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartService.clearCart();
      set({ cart: null });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
