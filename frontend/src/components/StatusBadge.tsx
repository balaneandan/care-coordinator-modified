import { AppointmentTypeDetails } from "@/lib/constants";
import { cn, title } from "@/lib/utils";
import { Status } from "@/types/enums";
import Image from "next/image";

type StatusBadgeProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const details = AppointmentTypeDetails.find((item) => item.status === status);

  return (
    <div className={cn("status-badge", details!.iconColour)}>
      <Image
        src={details!.iconUrl}
        width={24}
        height={24}
        alt={status}
        className="h-fit w-3"
      />
      <p className={cn("text-12-semibold capitalize", details!.textColour)}>
        {title(status)}
      </p>
    </div>
  );
};

export default StatusBadge;
