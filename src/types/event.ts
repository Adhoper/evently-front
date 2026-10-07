export type EventStatus =
  | "Draft"
  | "Published"
  | "Cancelled"
  | "Finished";

export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  location: string;
  capacity: number;
  imageUrl: string | null;
  status: EventStatus;
  eventCategoryId: number;
  categoryName: string;
}

export interface EventDetail
  extends Event {
  description: string;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  startTime: string;
  location: string;
  capacity: number;
  imageUrl: string | null;
  eventCategoryId: number;
}