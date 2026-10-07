import api from "../api/axios";

import type {
  CheckInResult,
  Ticket,
} from "../types/ticket";

export const getMyTickets =
  async (): Promise<Ticket[]> => {
    const response =
      await api.get<Ticket[]>(
        "/tickets/mine"
      );

    return response.data;
  };

export const getMyTicketById =
  async (
    id: number
  ): Promise<Ticket> => {
    const response =
      await api.get<Ticket>(
        `/tickets/mine/${id}`
      );

    return response.data;
  };

export const reserveTicket =
  async (
    eventId: number
  ): Promise<Ticket> => {
    const response =
      await api.post<Ticket>(
        `/tickets/events/${eventId}/reserve`
      );

    return response.data;
  };

export const cancelTicket =
  async (
    ticketId: number
  ): Promise<Ticket> => {
    const response =
      await api.patch<Ticket>(
        `/tickets/${ticketId}/cancel`
      );

    return response.data;
  };

export const checkInTicket =
  async (
    code: string
  ): Promise<CheckInResult> => {
    const response =
      await api.post<CheckInResult>(
        "/tickets/check-in",
        {
          code,
        }
      );

    return response.data;
  };