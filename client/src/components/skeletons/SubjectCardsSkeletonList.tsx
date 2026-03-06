const SubjectCardSkeleton = () => {
  return (
    <div className="card-subject">
      <div className="h-6 w-30 rounded bg-white/10 animate-pulse" />
    </div>
  );
};

export const SubjectCardsSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SubjectCardSkeleton key={i} />
      ))}
    </div>
  );
};
