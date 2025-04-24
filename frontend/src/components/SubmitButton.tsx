import { Button } from "@/components/ui/button";
import Image from "next/image";

type SubmitBtnProps = {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
};

const SubmitButton = ({ isLoading, className, children }: SubmitBtnProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
