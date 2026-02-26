const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`
      animate-pulse
      bg-white/10
      rounded-md
      ${className}
    `}
  />
);

export const FiltersSkeleton = () => {
  return (
    <div className="bg-white/10 w-72.5 sm:w-full lg:w-78 p-5 rounded-[30px]">
      <Skeleton className="h-5 w-24 mb-5" />

      <div className="flex flex-col items-start py-5 mr-7.5 mb-5 border-light-100 border-b border-t">
        <Skeleton className="h-4 w-20 mb-5" />

        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-5 mb-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-full rounded-full" />
      </div>

      <div className="mb-5">
        <Skeleton className="h-3 w-32 mb-5" />
        <div className="flex flex-col gap-4 py-5 border-light-100 border-b border-t">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-40" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-6">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};
