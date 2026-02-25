type ProfileIndicatorVariant = "main" | "private";

type Props = {
  variant?: ProfileIndicatorVariant;
};

export const ProfileIndicatorSkeleton = ({ variant = "private" }: Props) => {
  const wrapperClass =
    variant === "private"
      ? "hidden md:flex flex-row items-center gap-2 md:gap-3"
      : "flex flex-row items-center gap-2 md:gap-3";

  return (
    <div className={`${wrapperClass} animate-pulse w-47 h-10`}>
      <div className="flex items-center gap-3">
        <div className="w-9.5 h-9.5 rounded-full bg-white/10" />
        <div className="h-4 w-28 rounded-md bg-white/10" />
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="w-5 h-5 rounded bg-white/10" />
        <div className="hidden md:block h-4 w-16 rounded-md bg-white/10" />
      </div>
    </div>
  );
};
