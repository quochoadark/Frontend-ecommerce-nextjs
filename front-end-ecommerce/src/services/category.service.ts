import { apiFetch } from './api';

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export async function getAllCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>('/categories');
}

export async function getCategoryById(id: number): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/categories/${id}`);
}

export async function createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: CreateCategoryRequest): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
}
