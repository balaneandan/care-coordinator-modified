import { SingleAppointmentItem } from "@/types/api";
import { columns } from "./columns";
import { DataTable } from "./DataTable";

type AppointmentTableProps = {
  data: SingleAppointmentItem[];
};

const AppointmentTable = ({ data }: AppointmentTableProps) => {
  return <DataTable columns={columns} data={data} />;
};

export { AppointmentTable, columns };
