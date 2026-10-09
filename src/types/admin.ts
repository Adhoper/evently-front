export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  organizers: number;
  totalEvents: number;
  publishedEvents: number;
  totalReservations: number;
  totalCheckIns: number;
  totalCategories: number;
}

export type ManagedUserRole = "User" | "Organizer" | "Admin";

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: ManagedUserRole;
  isActive: boolean;
  createdAt: string;
  eventsCount: number;
  ticketsCount: number;
}

export interface AdminEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  location: string;
  capacity: number;
  status: "Draft" | "Published" | "Cancelled" | "Finished";
  categoryName: string;
  organizerName: string;
  organizerEmail: string;
  reservations: number;
  checkIns: number;
  createdAt: string;
}
