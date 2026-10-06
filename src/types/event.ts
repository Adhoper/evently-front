export interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  location: string;
  capacity: number;
  imageUrl: string | null;
  status: string;
  eventCategoryId: number;
  categoryName: string;
}

export interface EventDetail extends Event {
  description: string;
  createdAt: string;
}