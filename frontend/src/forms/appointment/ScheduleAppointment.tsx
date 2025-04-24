"use client";

import { scheduleAppointment } from "@/actions/appointment.actions";
import DynamicFormField from "@/components/DynamicFormField";
import ErrorPanel from "@/components/ErrorPanel";
import { Loading } from "@/components/Loading";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useProjectStore } from "@/hooks/useProjectStore";
import { AppointmentTypeDetails } from "@/lib/constants";
import { ScheduleAppointmentSchema } from "@/lib/validation";

import {
  ErrorMsg,
  ScheduleAppointmentParams,
  SingleAppointmentItem,
} from "@/types/api";
import { Doctor } from "@/types/common";
import { FormFieldType } from "@/types/enums";
import { ScheduleFormType } from "@/types/forms";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ScheduleAppointmentProps = {
  appointment: SingleAppointmentItem;
};

const ScheduleAppointment = ({ appointment }: ScheduleAppointmentProps) => {
  const [type, setType] = useState("schedule");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMsg | null>(null);
  const [formData, setFormData] = useState<ScheduleFormType>({
    primaryPhysician: appointment ? appointment.physician.name : "",
    reason: appointment ? appointment.reason : "",
    notes: appointment ? appointment.notes : "",
    schedule: appointment ? new Date(appointment.schedule) : new Date(),
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get("appointmentId") ?? "";

  const { doctors, doctorsLoading } = useProjectStore();

  const form = useForm<z.infer<typeof ScheduleAppointmentSchema>>({
    resolver: zodResolver(ScheduleAppointmentSchema),
    defaultValues: formData,
  });

  const onSubmit = async (
    formValues: z.infer<typeof ScheduleAppointmentSchema>
  ) => {
    setIsLoading(true);
    try {
      const details = AppointmentTypeDetails.find((item) => item.type === type);
      const doctor = doctors!.find(
        (item) => formValues.primaryPhysician === item.name
      );

      if (details && doctor) {
        const appointmentData: ScheduleAppointmentParams = {
          ...formValues,
          primaryPhysician: doctor.id,
          id: appointmentId,
          status: details.status,
          notes: formValues.notes ?? "",
        };

        const { appointmentId: appointmentResponse, appointmentError } =
          await scheduleAppointment(appointmentData);

        if (appointmentResponse) {
          form.reset();
          router.push("/admin?success=true");
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
        <DynamicFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Doctor"
          placeholder="Select a doctor"
        >
          {doctorsLoading ? (
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
          placeholder="Notes related to the appointment"
        />

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
          Schedule Appointment
        </SubmitButton>

        {error && <ErrorPanel error={error} />}
      </form>
    </Form>
  );
};

export default ScheduleAppointment;
