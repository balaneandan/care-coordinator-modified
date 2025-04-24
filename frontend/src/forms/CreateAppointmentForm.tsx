"use client";

import { addAppointment } from "@/actions/appointment.actions";
import DynamicFormField from "@/components/DynamicFormField";
import ErrorPanel from "@/components/ErrorPanel";
import { Loading } from "@/components/Loading";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useProjectStore } from "@/hooks/useProjectStore";
import {
  AppointmentFormDefaults,
  AppointmentTypeDetails,
} from "@/lib/constants";
import { CreateAppointmentSchema } from "@/lib/validation";

import { CreateAppointmentParams, ErrorMsg } from "@/types/api";
import { Doctor } from "@/types/common";
import { FormFieldType } from "@/types/enums";
import { AppointmentFormType } from "@/types/forms";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AppointmentFormProps = {
  userId: string;
  patientId: string;
};

const CreateAppointmentForm = ({ userId, patientId }: AppointmentFormProps) => {
  const [type, setType] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [formData, setFormData] = useState<AppointmentFormType>(
    AppointmentFormDefaults
  );
  const router = useRouter();

  const { doctors, doctorsLoading, fetchDoctors } = useProjectStore();

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: formData,
  });

  const onSubmit = async (
    formValues: z.infer<typeof CreateAppointmentSchema>
  ) => {
    setIsLoading(true);
    try {
      const details = AppointmentTypeDetails.find((item) => item.type === type);

      if (details && patientId) {
        const appointmentData: CreateAppointmentParams = {
          userId,
          patient: patientId,
          primaryPhysician: doctors!.find(
            (item) => item.name === formValues.primaryPhysician
          )!.id,
          schedule: new Date(formValues.schedule),
          reason: formValues.reason!,
          status: details.status,
          notes: formValues.notes,
        };

        const { appointmentId, appointmentError } = await addAppointment(
          appointmentData
        );

        if (appointmentId) {
          router.push(
            `/patients/${userId}/new-appointment/success?patientId=${patientId}&appointmentId=${appointmentId.id}`
          );
        } else {
          setFormData(formValues);
          setIsLoading(false);
          setError(appointmentError);
        }
      }
    } catch (error: any) {
      console.log(error);
      setFormData(formValues);
      setIsLoading(false);
      setError({
        status: "error",
        code: 500,
        response: "500_INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Last Step! 🚀</h1>
          <p className="text-dark-700">Request a new appointment in seconds.</p>
        </section>

        <DynamicFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Doctor"
          placeholder="Select a doctor"
        >
          {doctorsLoading && !doctors ? (
            <SelectItem value="loading">
              <Loading width={10} height={10} />
            </SelectItem>
          ) : (
            doctors &&
            doctors.map((doctor: Doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.avatarIcon}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))
          )}
        </DynamicFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <DynamicFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="reason"
            label="Reason For Appointment"
            placeholder="The reason for your appointment"
          />

          <DynamicFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="Additional information we need to know"
          />
        </div>

        <DynamicFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Expected Appointment Date"
          placeholder="Select your appointment date and time"
          showTimeSelect
          dateFormat="dd/MM/yyyy, hh:mm:aa"
        />

        <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full">
          Create Appointment
        </SubmitButton>

        {error && <ErrorPanel error={error} />}
      </form>
    </Form>
  );
};

export default CreateAppointmentForm;
