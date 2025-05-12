import { z } from "zod";
import validator from "validator";
import { Gender, IdentificationTypes } from "@/types/enums";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, "Name cannot exceed 50 characters."),
  email: z.string().email("Invalid email address."),
  phone: z
    .string()
    .refine(
      (phone) => validator.isMobilePhone(phone, "any", { strictMode: true }),
      {
        message: "Invalid phone number.",
      }
    ),
});

export const SignInFormValidation = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters.",
    })
    .max(50, "Password cannot exceed 50 characters."),
});


export const RegistrationFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => validator.isMobilePhone(phone, "any", { strictMode: true }),
      { message: "Invalid phone number" }
    ),
  birthDate: z.coerce.date(),
  gender: z.nativeEnum(Gender),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(100, "Occupation must be at most 100 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (phone) => validator.isMobilePhone(phone, "any", { strictMode: true }),
      { message: "Invalid phone number" }
    ),
  primaryPhysician: z.string().min(2, "Please select a doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.nativeEnum(IdentificationTypes, {
    message: "A type must be selected",
  }),
  identificationNumber: z.string().min(3, {
    message: "Identification number must be at least 3 characters",
  }),
  identificationDocument: z.custom<File[]>(
    (val) => val,
    "An identification document is required"
  ),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Please select a doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(300, "Reason must be at most 300 characters"),
  notes: z
    .string()
    .max(300, "Reason must be at most 300 characters")
    .optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Please select a doctor"),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(300, "Reasons must be at most 300 characters"),
  notes: z
    .string()
    .max(300, "Reason must be at most 300 characters")
    .optional(),
  schedule: z.coerce.date(),
});

export const CancelAppointmentSchema = z.object({
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(300, "Reason must be at most 300 characters"),
});
