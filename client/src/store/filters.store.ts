import { persist } from "zustand/middleware";
import {
  SortBy,
  SortDirection,
  TeachersQuery,
} from "../api/teacher/teacher.type.ts";
import { create } from "zustand";

type TeachersFiltersState = {
  subject?: string;
  minPrice: number;
  maxPrice: number;
  ratings: number[];

  subjectDraft?: string;
  minPriceDraft: number;
  maxPriceDraft: number;
  ratingsDraft: number[];

  setSubjectDraft: (v?: string) => void;
  setPriceDraft: (min: number, max: number) => void;
  setRatingsDraft: (v: number[]) => void;
  setFromExternalQuery: (q: { subject?: string }) => void;
  applyDraft: () => void;
  resetDraft: () => void;

  sortBy: SortBy;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  setSort: (by: SortBy, dir: SortDirection) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clear: () => void;
  getQuery: () => TeachersQuery;
};

const DEFAULTS = {
  subject: undefined,
  minPrice: 0,
  maxPrice: 200,
  ratings: [] as number[],

  subjectDraft: undefined,
  minPriceDraft: 0,
  maxPriceDraft: 200,
  ratingsDraft: [] as number[],

  sortBy: "createdAt" as const,
  sortDirection: "desc" as const,
  pageNumber: 1,
  pageSize: 10,
};

export const useTeachersFiltersStore = create<TeachersFiltersState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setSubjectDraft: (v) => set({ subjectDraft: v || undefined }),
      setPriceDraft: (min, max) =>
        set({ minPriceDraft: min, maxPriceDraft: max }),
      setRatingsDraft: (v) => set({ ratingsDraft: v }),

      applyDraft: () => {
        const s = get();
        set({
          subject: s.subjectDraft,
          minPrice: s.minPriceDraft,
          maxPrice: s.maxPriceDraft,
          ratings: s.ratingsDraft,
          pageNumber: 1,
        });
      },

      resetDraft: () => {
        const s = get();
        set({
          subjectDraft: s.subject,
          minPriceDraft: s.minPrice,
          maxPriceDraft: s.maxPrice,
          ratingsDraft: s.ratings,
        });
      },

      setSort: (by, dir) =>
        set({ sortBy: by, sortDirection: dir, pageNumber: 1 }),
      setPage: (page) => set({ pageNumber: page }),
      setPageSize: (size) => set({ pageSize: size, pageNumber: 1 }),

      clear: () =>
        set({
          ...DEFAULTS,
          pageNumber: 1,
        }),

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
      setFromExternalQuery: ({ subject }) => {
        set({
          subject: subject || undefined,
          subjectDraft: subject || undefined,

          minPrice: 0,
          maxPrice: 200,
          ratings: [],
          minPriceDraft: 0,
          maxPriceDraft: 200,
          ratingsDraft: [],
          pageNumber: 1,
        });
      },
    }),
    { name: "teachers-filters" },
  ),
);
