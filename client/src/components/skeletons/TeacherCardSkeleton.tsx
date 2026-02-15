export const TeacherCardSkeleton = () => {
  return (
    <div
      className="animate-pulse flex flex-col items-center xl:flex-row border bg-[#15141D80] border-blue-500
                 px-4 sm:px-6 md:px-9 py-6 md:py-9 rounded-[25px]"
    >
      <div
        className="flex-1 min-w-0 flex flex-col xl:flex-row gap-3.75
                   xl:border-r border-[#ffffff10] xl:pr-5.75"
      >
        <div className="flex items-center flex-col gap-3.75">
          <div
            className="w-28 h-28
                       md:w-37.5 md:h-37.5
                       lg:w-43.25 lg:h-43.25
                       xl:w-48 xl:h-48
                       overflow-hidden rounded-[25px]
                       bg-white/10"
          />

          <div className="pb-2.25 border-b border-light-200 w-full flex justify-center">
            <div className="h-5 md:h-6 lg:h-6 xl:h-7 w-40 bg-white/10 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 min-w-0 w-full">
          <div className="h-6 w-48 bg-white/10 rounded-full" />

          <div className="flex flex-col gap-5 w-full max-w-116.25">
            <div className="h-4 w-44 bg-white/10 rounded-md" />
            <div className="h-4 w-64 bg-white/10 rounded-md" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded-md" />
              <div className="h-4 w-[92%] bg-white/10 rounded-md" />
              <div className="h-4 w-[80%] bg-white/10 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-50 flex flex-col items-center justify-center gap-3.75 md:pl-9.25 mt-6 xl:mt-0">
        <div className="h-8 md:h-10 lg:h-11 xl:h-12 w-28 bg-white/10 rounded-md" />
        <div className="h-5 md:h-6 w-16 bg-white/10 rounded-md" />

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-4 bg-white/10 rounded-sm" />
          ))}
        </div>

        <div className="h-10 w-32 bg-white/10 rounded-full" />

        <div className="h-4 w-36 bg-white/10 rounded-md" />
      </div>
    </div>
  );
};
