"use server";

import FetchClient from "@/lib/fetch-client";
import {
  APIDataId,
  AppointmentListData,
  AppointmentSuccessDetails,
  CancelAppointmentParams,
  CreateAppointmentParams,
  ScheduleAppointmentParams,
} from "@/types/api";

const fetch = new FetchClient(undefined, "/api/appointment");

export const addAppointment = async (appointment: CreateAppointmentParams) => {
  const { data: appointmentId, error: appointmentError } =
    await fetch.post<APIDataId>("/create", appointment);
  return { appointmentId, appointmentError };
};

export const getAppointments = async () => {
  const { data: appointments, error: appointmentError } =
    await fetch.get<AppointmentListData>("/list");
  return { appointments, appointmentError };
};

export const getSuccessDetails = async (id: string) => {
  const { data: appointment, error: appointmentError } =
    await fetch.get<AppointmentSuccessDetails>(`/${id}/success`);
  return { appointment, appointmentError };
};

export const cancelAppointment = async (
  appointment: CancelAppointmentParams
) => {
  const { data: appointmentId, error: appointmentError } =
    await fetch.patch<APIDataId>("/cancel", appointment);
  return { appointmentId, appointmentError };
};

export const scheduleAppointment = async (
  appointment: ScheduleAppointmentParams
) => {
  const { data: appointmentId, error: appointmentError } =
    await fetch.patch<APIDataId>("/schedule", appointment);
  return { appointmentId, appointmentError };
};
