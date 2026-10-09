export interface TopEvent {
  id: number;
  title: string;
  reservations: number;
  checkIns: number;
  capacity: number;
  occupancyRate: number;
}

export interface OrganizerDashboard {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  cancelledEvents: number;
  finishedEvents: number;

  totalReservations: number;
  totalCheckIns: number;
  totalCapacity: number;

  attendanceRate: number;
  occupancyRate: number;

  topEvent: TopEvent | null;
}

export type AttendeeStatus =
  | "Reserved"
  | "CheckedIn"
  | "Cancelled";

export interface Attendee {
  ticketId: number;
  userId: number;

  fullName: string;
  email: string;

  status: AttendeeStatus;

  reservedAt: string;
  checkedInAt: string | null;
}

export interface EventAttendees {
  eventId: number;
  title: string;
  status: string;

  date: string;
  startTime: string;
  location: string;

  capacity: number;
  reservedCount: number;
  checkedInCount: number;
  cancelledCount: number;
  availableSpots: number;

  occupancyRate: number;
  attendanceRate: number;

  attendees: Attendee[];
}