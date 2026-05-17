import { apiFetch } from './api';

export interface ProductSummaryResponse {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
}

export interface ProductResponse extends ProductSummaryResponse {
  description: string;
  imageUrls: string[];
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface GetProductsParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export async function getProducts(params?: GetProductsParams): Promise<Page<ProductSummaryResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value));
      }
    });
  }
  return apiFetch<Page<ProductSummaryResponse>>(`/products?${query.toString()}`);
}

export async function getProductById(id: number): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`);
}

export async function createProduct(data: Record<string, unknown>): Promise<ProductResponse> {
  return apiFetch<ProductResponse>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: Record<string, unknown>): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadProductImage(id: number, file: File): Promise<ProductResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = typeof window !== 'undefined' ? (await import('js-cookie')).default.get('access_token') : undefined;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  const res = await fetch(`${baseUrl}/products/${id}/images`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}
