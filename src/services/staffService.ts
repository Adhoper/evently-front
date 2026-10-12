import api from "../api/axios";

import type {
  AddEventStaffRequest,
  EventStaffMember,
  StaffEvent,
} from "../types/staff";

export const getEventStaff = async (
  eventId: number,
): Promise<EventStaffMember[]> => {
  const response = await api.get<EventStaffMember[]>(
    `/organizer/events/${eventId}/staff`,
  );

  return response.data;
};

export const addEventStaff = async (
  eventId: number,
  data: AddEventStaffRequest,
): Promise<EventStaffMember> => {
  const response = await api.post<EventStaffMember>(
    `/organizer/events/${eventId}/staff`,
    data,
  );

  return response.data;
};

export const removeEventStaff = async (
  eventId: number,
  userId: number,
): Promise<void> => {
  await api.delete(
    `/organizer/events/${eventId}/staff/${userId}`,
  );
};

export const getMyStaffEvents = async (): Promise<StaffEvent[]> => {
  const response = await api.get<StaffEvent[]>("/staff/events");

  return response.data;
};
