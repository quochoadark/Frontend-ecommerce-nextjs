// src/services/user.service.ts
import { apiFetch } from './api';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  // add other fields as defined in backend User DTO if needed
}

export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me');
}
