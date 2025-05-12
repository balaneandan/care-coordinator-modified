import { Doctor, PatientCore } from "./common";
import { Status } from "./enums";
import { PatientDetails } from "./forms";

export type CreateUser = {
  name: string;
  email: string;
  phone: string;
};

export type SignInUser = {
  email: string;
  password: string;
};

export type VerifyOTP = {
  challengeId: string;
  otp: string;
  session_token: string;
}

export type User = CreateUser & {
  userID: string;
};

export type CreatePatient = PatientDetails & {
  userId: string;
  primaryPhysician: string;
  identificationDocumentId?: string;
};

export type APIDataId = {
  id: string;
};

export type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  schedule: Date;
  reason: string;
  status: string;
  notes?: string;
  cancellationReason?: string;
};

export type ScheduleAppointmentParams = {
  id: string;
  primaryPhysician: string;
  reason: string;
  notes: string;
  schedule: Date;
  status: string;
};

export type CancelAppointmentParams = {
  id: string;
  status: string;
  cancellationReason?: string;
};

export type ErrorMsg = {
  status: string;
  code: number;
  response: string;
  message: string;
};

export type UserResponse = {
  status: string;
  code: number;
  response: string;
  data: User;
  headers: null;
};

export type AppointmentSuccessDetails = {
  id: string;
  schedule: string;
  doctor: Doctor;
};

export type SingleAppointmentItem = {
  id: string;
  reason: string;
  notes: string;
  schedule: Date;
  status: Status;
  cancellationReason: string;
  userId: string;
  patient: PatientCore;
  physician: Doctor;
};

export type AppointmentListData = {
  appointments: SingleAppointmentItem[];
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
};
