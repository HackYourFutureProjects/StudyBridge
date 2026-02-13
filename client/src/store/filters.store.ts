import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TeachersQuery,
  SortBy,
  SortDirection,
} from "../api/teacher/teacher.type";

type TeachersFiltersState = {
  subject?: string;
  minPrice: number;
  maxPrice: number;
  ratings: number[];
  sortBy: SortBy;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;

  setSubject: (v?: string) => void;
  setPrice: (min: number, max: number) => void;
  setRatings: (v: number[]) => void;
  setSort: (by: SortBy, dir: SortDirection) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clear: () => void;
  getQuery: () => TeachersQuery;
};

const DEFAULTS = {
  subject: undefined,
  minPrice: 0,
  maxPrice: 500,
  ratings: [] as number[],
  sortBy: "createdAt" as const,
  sortDirection: "desc" as const,
  pageNumber: 1,
  pageSize: 10,
};

export const useTeachersFiltersStore = create<TeachersFiltersState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setSubject: (v) => set({ subject: v || undefined, pageNumber: 1 }),

      setPrice: (min, max) =>
        set({ minPrice: min, maxPrice: max, pageNumber: 1 }),

      setRatings: (v) => set({ ratings: v, pageNumber: 1 }),

      setSort: (by, dir) =>
        set({ sortBy: by, sortDirection: dir, pageNumber: 1 }),

      setPage: (page) => set({ pageNumber: page }),

      setPageSize: (size) => set({ pageSize: size, pageNumber: 1 }),

      clear: () => set({ ...DEFAULTS }),

      getQuery: () => {
        const s = get();
        return {
          subject: s.subject,
          minPrice: s.minPrice,
          maxPrice: s.maxPrice,
          ratings: s.ratings,

          sortBy: s.sortBy,
          sortDirection: s.sortDirection,
          pageNumber: s.pageNumber,
          pageSize: s.pageSize,
        };
      },
    }),
    { name: "teachers-filters" },
  ),
);
