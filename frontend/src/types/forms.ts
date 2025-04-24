import { CreateUser } from "./api";
import { Gender, IdentificationTypes } from "./enums";

export type PatientDetails = CreateUser & {
  birthDate?: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  identificationType?: IdentificationTypes;
  identificationNumber: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
};

export type PatientDetailsForm = PatientDetails & {
  primaryPhysician: string;
  identificationDocument?: File[];
};

export type AppointmentFormType = {
  primaryPhysician?: string;
  reason?: string;
  notes?: string;
  schedule?: Date;
  cancellationReason?: string;
};

export type CancellationFormType = {
  cancellationReason: string;
};

export type ScheduleFormType = {
  primaryPhysician: string;
  reason: string;
  notes?: string;
  schedule?: Date;
};
