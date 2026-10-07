export type TicketStatus =
  | "Reserved"
  | "CheckedIn"
  | "Cancelled";

export interface Ticket {
  id: number;
  code: string;
  status: TicketStatus;

  reservedAt: string;
  checkedInAt: string | null;

  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventStartTime: string;
  eventLocation: string;
  eventImageUrl: string | null;

  categoryName: string;
}

export interface CheckInResult {
  ticketId: number;
  code: string;
  status: string;
  checkedInAt: string;

  eventId: number;
  eventTitle: string;

  attendeeName: string;
  attendeeEmail: string;
}