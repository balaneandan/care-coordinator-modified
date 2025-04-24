"use client";

import { ColumnDef } from "@tanstack/react-table";

import AppointmentModal from "@/components/AppointmentModal";
import StatusBadge from "@/components/StatusBadge";

import { formatDateTime } from "@/lib/utils";
import { SingleAppointmentItem } from "@/types/api";

import Image from "next/image";

export const columns: ColumnDef<SingleAppointmentItem>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.patient.name}</p>;
    },
  },
  {
    accessorKey: "schedule",
    header: "Date & Time",
    cell: ({ row }) => {
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(new Date(row.original.schedule))}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={row.original.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "physician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.physician;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor.avatarIcon}
            width={100}
            height={100}
            alt={doctor.name}
            className="size-8"
          />
          <p className="whitespace-nowrap">{doctor.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="schedule"
            appointment={data}
            description="Please fill in the following details:"
          />
          <AppointmentModal
            type="cancel"
            appointment={data}
            description="Are you sure you want to cancel this appointment?"
          />
        </div>
      );
    },
  },
];
