
import api from "../api/axios";

import type {
  Event,
  EventDetail,
} from "../types/event";

export const getPublicEvents =
  async (): Promise<Event[]> => {
    const response =
      await api.get<Event[]>("/events");

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