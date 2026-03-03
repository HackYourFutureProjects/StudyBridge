import { CardsList } from "../../components/cardsList/CardsList";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { useRef, useState } from "react";
import { TeachersCardsSkeletonList } from "../../components/skeletons/TeachersCardsSkeletonList.tsx";
import { SortByTeachersForModerator } from "../../api/teacher/teacher.type.ts";
import { useTeachersForModeratorQuery } from "../../features/teachers/query/useTeacherForModeratorQuery.tsx";

export const ModeratorTeachersPage = () => {
  const [page, setPage] = useState(1);
  const [sortBy] = useState<SortByTeachersForModerator>("status");
  const listTopRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = (page: number) => {
    setPage(page);

    requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({
        block: "start",
      });
    });
  };

  const { data, isFetching } = useTeachersForModeratorQuery({
    pageNumber: page,
    pageSize: 10,
    sortBy,
  });

  return (
    <div
      ref={listTopRef}
      className="
           flex flex-col items-center justify-center
            w-full mx-auto
            max-w-360
            px-4 sm:px-6 md:px-10 lg:px-20
            py-3 md:py-2 lg:py-3
            "
    >
      <h1 className="auth-title">TEACHERS</h1>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start w-full">
        <div className="w-full lg:flex-1 min-w-0">
          {isFetching ? (
            <TeachersCardsSkeletonList count={10} />
          ) : data?.items?.length ? (
            <CardsList cards={data.items} />
          ) : (
            <div className="text-light-100 text-center">No teachers</div>
          )}
          <div className="flex flex-col items-center gap-5 mt-10">
            <Pagination
              theme="primary"
              shape="round"
              activeIndex={page}
              onIndexChange={handlePageChange}
              totalPages={data?.pagesCount ?? 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
