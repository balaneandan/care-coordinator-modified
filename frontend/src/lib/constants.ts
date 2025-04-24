import { AppointmentDetails, ImageType } from "@/types/common";
import { Gender, Status } from "@/types/enums";

export const Logo: ImageType = {
  src: "/logo.svg",
  height: 1000,
  width: 1000,
  alt: "Care Coordinator logo",
};

export const DisplayImg: ImageType = {
  src: "/onboarding.png",
  height: 1000,
  width: 1000,
  alt: "Onboarding",
  className: "max-w-[55%]",
};

export const RegisterImg: ImageType = {
  src: "/register.png",
  height: 1000,
  width: 1000,
  alt: "Register",
  className: "max-w-[390px]",
};

export const AppointmentImg: ImageType = {
  src: "/appointment.png",
  height: 1000,
  width: 1000,
  alt: "Appointment",
  className: "max-w-[390px] bg-bottom",
};

export const RegistrationFormDefaults = {
  name: "",
  email: "",
  phone: "",
  birthDate: undefined,
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: undefined,
  identificationNumber: "",
  identificationDocument: undefined,
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const AppointmentFormDefaults = {
  primaryPhysician: "",
  reason: "",
  notes: "",
  schedule: new Date(),
  cancellationReason: "",
};

export const AppointmentTypeDetails: AppointmentDetails[] = [
  {
    type: "create",
    status: Status.PENDING,
    iconUrl: "/icons/pending.svg",
    iconColour: "bg-blue-600",
    textColour: "text-blue-500",
  },
  {
    type: "cancel",
    status: Status.CANCELLED,
    iconUrl: "/icons/cancelled.svg",
    iconColour: "bg-red-600",
    textColour: "text-red-500",
  },
  {
    type: "schedule",
    status: Status.SCHEDULED,
    iconUrl: "/icons/appointments.svg",
    iconColour: "bg-green-600",
    textColour: "text-green-500",
  },
];
