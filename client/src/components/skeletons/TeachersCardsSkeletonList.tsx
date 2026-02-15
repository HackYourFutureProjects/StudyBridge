import { TeacherCardSkeleton } from "./TeacherCardSkeleton.tsx";

type Props = {
  count?: number;
};

export const TeachersCardsSkeletonList = ({ count = 10 }: Props) => {
  return (
    <div className="flex flex-col gap-7.5">
      {Array.from({ length: count }).map((_, i) => (
        <TeacherCardSkeleton key={i} />
      ))}
    </div>
  );
};
