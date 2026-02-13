import { TeachersQuery } from "../api/teacher/teacher.type.ts";

export const queryKeys = {
  me: ["auth", "me"] as const,

  students: ["students"] as const,
  teachers: ["teachers"] as const,
  teacher: (id: string) => ["teachers", id] as const,
  appointments: ["appointments"] as const,
  teachersList: (params: TeachersQuery) => ["teachers", params] as const,
};
