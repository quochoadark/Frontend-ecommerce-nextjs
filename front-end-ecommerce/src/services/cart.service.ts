import { apiFetch } from './api';

export interface CartItemResponse {
  itemId: number;
  productId: number;
  productTitle: string;
  thumbnail: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
}

export async function getCart(): Promise<CartResponse> {
  return apiFetch<CartResponse>('/cart');
}

export async function addToCart(productId: number, quantity: number): Promise<CartResponse> {
  return apiFetch<CartResponse>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartResponse> {
  return apiFetch<CartResponse>(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: number): Promise<CartResponse> {
  return apiFetch<CartResponse>(`/cart/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function clearCart(): Promise<void> {
  return apiFetch<void>('/cart', {
    method: 'DELETE',
  });
}
