import { ErrorMsg } from "@/types/api";

const ErrorPanel = ({ error }: { error: ErrorMsg }) => {
  return (
    <div className="p-3 bg-red-900 rounded-sm">
      <p>{`Error ${error.code}: ${error.message}`}</p>
    </div>
  );
};

export default ErrorPanel;
