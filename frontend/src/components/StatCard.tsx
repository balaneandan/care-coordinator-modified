import { AppointmentTypeDetails } from "@/lib/constants";
import { cn, title } from "@/lib/utils";
import { AppointmentType } from "@/types/common";
import Image from "next/image";

type StatCardProps = {
  type: AppointmentType;
  count: number;
};

const StatCard = ({ type, count = 0 }: StatCardProps) => {
  const details = AppointmentTypeDetails.find((item) => item.type === type);
  const label = `${title(details!.status)} appointments`;

  return (
    <div
      className={cn("stat-card", {
        "bg-appointments": type === "schedule",
        "bg-pending": type === "create",
        "bg-cancelled": type === "cancel",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={details!.iconUrl}
          height={32}
          width={32}
          alt={label}
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
