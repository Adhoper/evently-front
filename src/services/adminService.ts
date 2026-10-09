import api from "../api/axios";
import type { Category } from "../types/category";
import type { AdminDashboard, AdminEvent, AdminUser } from "../types/admin";

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const response = await api.get<AdminDashboard>("/admin/dashboard");
  return response.data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<AdminUser[]>("/admin/users");
  return response.data;
}

export async function updateAdminUserStatus(userId: number, isActive: boolean): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(`/admin/users/${userId}/status`, { isActive });
  return response.data;
}

export async function updateAdminUserRole(userId: number, role: "User" | "Organizer"): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(`/admin/users/${userId}/role`, { role });
  return response.data;
}

export async function getAdminEvents(): Promise<AdminEvent[]> {
  const response = await api.get<AdminEvent[]>("/admin/events");
  return response.data;
}

export async function cancelAdminEvent(eventId: number): Promise<AdminEvent> {
  const response = await api.patch<AdminEvent>(`/admin/events/${eventId}/cancel`);
  return response.data;
}

export async function getAdminCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/admin/categories");
  return response.data;
}

export async function createAdminCategory(name: string): Promise<Category> {
  const response = await api.post<Category>("/admin/categories", { name });
  return response.data;
}

export async function updateAdminCategory(categoryId: number, name: string): Promise<Category> {
  const response = await api.put<Category>(`/admin/categories/${categoryId}`, { name });
  return response.data;
}

export async function updateAdminCategoryStatus(categoryId: number, isActive: boolean): Promise<Category> {
  const response = await api.patch<Category>(`/admin/categories/${categoryId}/status`, { isActive });
  return response.data;
}
