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

const fetch = new FetchClient(undefined, "api/appointment");

export const addAppointment = async (appointment: CreateAppointmentParams, headers: HeadersInit) => {
  console.log('done')
  const { data: appointmentId, error: appointmentError } =
    await fetch.post<APIDataId>("/create", appointment, headers);
    
  return { appointmentId, appointmentError };
};

export const getAppointments = async (headers: HeadersInit) => {

  const { data: appointments, error: appointmentError } =
    await fetch.get<AppointmentListData>("/list", headers);
  return { appointments, appointmentError };
};

export const getSuccessDetails = async (id: string, headers: HeadersInit) => {
  const { data: appointment, error: appointmentError } =
    await fetch.get<AppointmentSuccessDetails>(`/${id}/success`, headers);
  return { appointment, appointmentError };
};

export const cancelAppointment = async (
  appointment: CancelAppointmentParams,
  headers: HeadersInit
) => {
  const { data: appointmentId, error: appointmentError } =
    await fetch.patch<APIDataId>("/cancel", appointment, headers);
  return { appointmentId, appointmentError };
};

export const scheduleAppointment = async (
  appointment: ScheduleAppointmentParams,
  headers: HeadersInit
) => {
  const { data: appointmentId, error: appointmentError } =
    await fetch.patch<APIDataId>("/schedule", appointment, headers);
  return { appointmentId, appointmentError };
};
