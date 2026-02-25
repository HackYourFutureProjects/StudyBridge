import type { QueryTeacherInput } from "../types/teacher/teacher.types.js";

export const buildTeacherFilter = (query: QueryTeacherInput) => {
  const filter: Record<string, unknown> = {};
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (query.subject?.trim()) {
    const q = escapeRegex(query.subject.trim());
    filter["subjects.subjectName"] = { $regex: q, $options: "i" };
  }

  if (query.minPrice != null || query.maxPrice != null) {
    const range: Record<string, number> = {};
    if (query.minPrice != null) {
      range.$gte = query.minPrice;
    }
    if (query.maxPrice != null) {
      range.$lte = query.maxPrice;
    }

    filter.priceFrom = range;
  }

  if (query.minRating != null || query.maxRating != null) {
    const range: Record<string, number> = {};
    if (query.minRating != null) {
      range.$gte = query.minRating;
    }
    if (query.maxRating != null) {
      range.$lte = query.maxRating;
    }

    filter.rating = range;
  }

  return filter;
};
