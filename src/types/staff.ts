export type StaffRole = "CheckIn";

export interface EventStaffMember {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  role: StaffRole;
  createdAt: string;
}

export interface StaffEvent {
  eventId: number;
  title: string;
  date: string;
  startTime: string;
  location: string;
  imageUrl: string | null;
  status: string;
  categoryName: string;
  organizerName: string;
  role: StaffRole;
}

export interface AddEventStaffRequest {
  email: string;
}
