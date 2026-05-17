import { apiFetch } from './api';

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  fullname: string;
  phoneNumber: string;
  address: string;
  note?: string;
  items: OrderItemRequest[];
}

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productTitle: string;
  productThumbnail: string;
  unitPrice: number;
  quantity: number;
  totalMoney: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  fullname: string;
  phoneNumber: string;
  address: string;
  note: string;
  orderDate: string;
  status: string;
  totalMoney: number;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderDetailResponse[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// User methods
export async function createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
  return apiFetch<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyOrders(page = 0, size = 10): Promise<Page<OrderResponse>> {
  return apiFetch<Page<OrderResponse>>(`/orders/my?page=${page}&size=${size}`);
}

export async function getMyOrderById(id: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/orders/my/${id}`);
}

export async function cancelOrder(id: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/orders/my/${id}/cancel`, {
    method: 'PATCH',
  });
}

// Admin methods
export async function getAllOrders(page = 0, size = 20): Promise<Page<OrderResponse>> {
  return apiFetch<Page<OrderResponse>>(`/orders?page=${page}&size=${size}`);
}

export async function getOrderById(id: number): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/orders/${id}`);
}

export async function updateOrderStatus(id: number, status: string): Promise<OrderResponse> {
  return apiFetch<OrderResponse>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
