import { QueryTeacherInput } from "../types/teacher/teacher.types.js";
import { TeacherSchemaType } from "../db/schemes/teacherSchema.js";
import type { Filter } from "mongodb";

type NumRange = { $gte?: number; $lte?: number };

type TeacherFilter = Filter<TeacherSchemaType> & {
  "subjects.subjectName"?: string | { $in: string[] };
};

export const buildTeacherFilter = (query: QueryTeacherInput): TeacherFilter => {
  const filter: TeacherFilter = {};

  if (query.subjects?.length) {
    filter["subjects.subjectName"] =
      query.subjects.length === 1 ? query.subjects[0] : { $in: query.subjects };
  }

  if (query.minPrice != null || query.maxPrice != null) {
    const priceRange: NumRange = {};
    if (query.minPrice != null) {
      priceRange.$gte = query.minPrice;
    }
    if (query.maxPrice != null) {
      priceRange.$lte = query.maxPrice;
    }
    filter.priceFrom = priceRange;
  }

  if (query.minRating != null || query.maxRating != null) {
    const ratingRange: NumRange = {};
    if (query.minRating != null) {
      ratingRange.$gte = query.minRating;
    }
    if (query.maxRating != null) {
      ratingRange.$lte = query.maxRating;
    }
    filter.rating = ratingRange;
  }

  return filter;
};
