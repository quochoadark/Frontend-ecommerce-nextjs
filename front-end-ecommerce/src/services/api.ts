// src/services/api.ts
// Centralized fetch wrapper for communicating with Spring Boot backend.
// Base URL can be adjusted via environment variable NEXT_PUBLIC_API_URL.

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const url = `${baseUrl}${endpoint}`;

  // Include JWT token from cookie if present.
  const token = typeof window !== 'undefined' ? (await import('js-cookie')).default.get('access_token') : undefined;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (!response.ok) {
    // Try to parse error message from backend.
    let errorMsg = `Request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.message) errorMsg = errData.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // If no content (e.g., 204), return undefined.
  if (response.status === 204) return undefined as unknown as T;

  const data = (await response.json()) as T;
  return data;
}
