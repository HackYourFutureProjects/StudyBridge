type HeaderNavSkeletonProps = {
  hideRegisterTutor?: boolean;
};

export const HeaderNavSkeleton = ({
  hideRegisterTutor = false,
}: HeaderNavSkeletonProps) => {
  return (
    <div className="hidden md:flex justify-center gap-4 sm:gap-6 lg:gap-7 border border-[#ffffff15] rounded-[20px] px-4 sm:px-6 lg:px-9.5 py-3">
      <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
      {!hideRegisterTutor && (
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
      )}
    </div>
  );
};
