import api from "../api/axios";

import type {
  EventAttendees,
  OrganizerDashboard,
} from "../types/organizer";

export const getOrganizerDashboard =
  async (): Promise<OrganizerDashboard> => {
    const response =
      await api.get<OrganizerDashboard>(
        "/organizer/dashboard"
      );

    return response.data;
  };

export const getEventAttendees =
  async (
    eventId: number
  ): Promise<EventAttendees> => {
    const response =
      await api.get<EventAttendees>(
        `/organizer/events/${eventId}/attendees`
      );

    return response.data;
  };