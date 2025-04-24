"use client";

import { SingleAppointmentItem } from "@/types/api";

import CancelAppointment from "./CancelAppointment";
import ScheduleAppointment from "./ScheduleAppointment";

type AppointmentFormProps = {
  type: "cancel" | "schedule";
  appointment: SingleAppointmentItem;
};

const AppointmentForm = ({ type, appointment }: AppointmentFormProps) => {
  return (
    <>
      {type === "cancel" ? (
        <CancelAppointment appointment={appointment!} />
      ) : (
        type === "schedule" && (
          <ScheduleAppointment appointment={appointment!} />
        )
      )}
    </>
  );
};

export default AppointmentForm;
