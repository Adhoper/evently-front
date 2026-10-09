import api from "../api/axios";

import type {
  CreateEventRequest,
  Event,
  EventDetail,
  EventImageResponse,
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

export const updateEvent =
  async (
    id: number,
    data: CreateEventRequest
  ): Promise<EventDetail> => {
    const response =
      await api.put<EventDetail>(
        `/events/${id}`,
        data
      );

    return response.data;
  };

export const publishEvent =
  async (
    id: number
  ): Promise<EventDetail> => {
    const response =
      await api.patch<EventDetail>(
        `/events/${id}/publish`
      );

    return response.data;
  };

export const cancelEvent =
  async (
    id: number
  ): Promise<EventDetail> => {
    const response =
      await api.patch<EventDetail>(
        `/events/${id}/cancel`
      );

    return response.data;
  };

export const uploadEventImage =
  async (
    eventId: number,
    file: File
  ): Promise<EventImageResponse> => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await api.post<EventImageResponse>(
        `/events/${eventId}/image`,
        formData
      );

    return response.data;
  };

export const removeEventImage =
  async (
    eventId: number
  ): Promise<void> => {
    await api.delete(
      `/events/${eventId}/image`
    );
  };
