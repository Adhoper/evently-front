import api from "../api/axios";

import type {
  CreateEventRequest,
  Event,
  EventDetail,
} from "../types/event";

export const getPublicEvents =
  async (): Promise<Event[]> => {
    const response =
      await api.get<Event[]>(
        "/events"
      );

    return response.data;
  };

export const getPublicEventById =
  async (
    id: number
  ): Promise<EventDetail> => {
    const response =
      await api.get<EventDetail>(
        `/events/${id}`
      );

    return response.data;
  };

export const getMyEvents =
  async (): Promise<Event[]> => {
    const response =
      await api.get<Event[]>(
        "/events/mine"
      );

    return response.data;
  };

export const getMyEventById =
  async (
    id: number
  ): Promise<EventDetail> => {
    const response =
      await api.get<EventDetail>(
        `/events/mine/${id}`
      );

    return response.data;
  };

export const createEvent =
  async (
    data: CreateEventRequest
  ): Promise<EventDetail> => {
    const response =
      await api.post<EventDetail>(
        "/events",
        data
      );

    return response.data;
  };