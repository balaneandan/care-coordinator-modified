import Image from "next/image";

type LoaderProps = {
  width?: number;
  height?: number;
};

export const Loading = ({ width = 100, height = 100 }: LoaderProps) => {
  return (
    <section className="container remove-scrollbar">
      <div className="flex flex-row text-14-regular">
        <Image
          src="/icons/loader.svg"
          width={width}
          height={height}
          alt="Loader"
          className="animate-spin mb-12 h-10 w-fit mr-4"
        />
        Loading...
      </div>
    </section>
  );
};
