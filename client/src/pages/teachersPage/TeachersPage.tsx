import { Filters } from "../../components/filters/Filters";
import { CardsList } from "../../components/cardsList/CardsList";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { useTeachersQuery } from "../../features/teachers/query/useTeachersQuery.tsx";
import { useTeachersFiltersStore } from "../../store/filters.store.ts";
import { useMemo } from "react";
import { TeachersQuery } from "../../api/teacher/teacher.type.ts";
import { useShallow } from "zustand/react/shallow";
export const TeachersPage = () => {
  const {
    subject,
    minPrice,
    maxPrice,
    ratings,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    setPage,
  } = useTeachersFiltersStore(
    useShallow((s) => ({
      subject: s.subject,
      minPrice: s.minPrice,
      maxPrice: s.maxPrice,
      ratings: s.ratings,
      sortBy: s.sortBy,
      sortDirection: s.sortDirection,
      pageNumber: s.pageNumber,
      pageSize: s.pageSize,
      setPage: s.setPage,
    })),
  );

  const params: TeachersQuery = useMemo(() => {
    const minRating = ratings.length ? Math.min(...ratings) : undefined;

    return {
      subject: subject || undefined,
      minPrice: minPrice === 0 ? undefined : minPrice,
      maxPrice: maxPrice === 500 ? undefined : maxPrice,
      minRating,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    };
  }, [
    subject,
    minPrice,
    maxPrice,
    ratings,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  ]);
  const { data, isFetching } = useTeachersQuery(params);

  return (
    <div
      className="
            flex items-center
            flex-col justify-center w-full max-w-360 mx-auto mt-20 py-20 px-20
            "
    >
      <h1 className="auth-title">OUR TEACHERS</h1>
      <h3 className="text-[16px] text-light-100 w-full max-w-170.75 text-center mb-20">
        Hey choose our platform for high-quality teaching, flexible learning,
        and professional support. From beginners to advanced learners, our
        clients see real progress and lasting results.
      </h3>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start w-full">
        <div className="w-full lg:w-75 shrink-0">
          <Filters />
        </div>
        <div className="w-full lg:flex-1 min-w-0">
          {isFetching && !data ? <div>Loading...</div> : null}

          {data?.items?.length ? (
            <CardsList cards={data.items} />
          ) : (
            <div>No teachers</div>
          )}

          <div className="flex flex-col items-center gap-5">
            <Pagination
              theme="primary"
              shape="round"
              activeIndex={pageNumber}
              onIndexChange={setPage}
              totalPages={data?.pagesCount ?? 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
