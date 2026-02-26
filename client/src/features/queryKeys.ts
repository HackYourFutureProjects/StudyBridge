import { TeachersQuery } from "../api/teacher/teacher.type.ts";

export const queryKeys = {
  me: ["auth", "me"] as const,

  students: {
    all: ["students"] as const,
    myProfile: () => ["students", "me"] as const,
  },
  teachers: {
    all: ["teachers"] as const,
    myProfile: () => ["teachers", "me"] as const,
    list: (params: TeachersQuery) => ["teachers", "list", params] as const,
  },
  teacher: (id: string) => ["teachers", id] as const,
  teachersList: (params: TeachersQuery) => ["teachers", params] as const,

  appointments: ["appointments"] as const,
  teacherAppointments: (teacherId: string, page?: number, limit?: number) =>
    ["appointments", "teacher", teacherId, page, limit] as const,
  studentAppointments: (studentId: string, page?: number, limit?: number) =>
    ["appointments", "student", studentId, page, limit] as const,
};
export const chatKeys = {
  conversations: ["chat", "conversations"] as const,
  messages: (conversationId: string) =>
    ["chat", "messages", conversationId] as const,
};

export const subjectsKey = {
  all: ["subjects"] as const,
};
