export const queryKeys = {
  me: ["auth", "me"] as const,

  students: ["students"] as const,
  teachers: ["teachers"] as const,
  teacher: (id: string) => ["teachers", id] as const,
  appointments: ["appointments"] as const,
  // teachersList: (params) => ['teachers', params] as const,
};
