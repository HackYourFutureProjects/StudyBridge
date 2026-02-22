import { TeachersQuery } from "../api/teacher/teacher.type.ts";

export const queryKeys = {
  me: ["auth", "me"] as const,

  students: ["students"] as const,
  teachers: {
    all: ["teachers"] as const,
    myProfile: () => ["teachers", "me"] as const,
    detail: (id: string) => ["teachers", id] as const,
    list: (params: TeachersQuery) => ["teachers", "list", params] as const,
  },
  teacher: (id: string) => ["teachers", id] as const,
  teachersList: (params: TeachersQuery) => ["teachers", params] as const,

  appointments: ["appointments"] as const,
  teacherAppointments: (teacherId: string) =>
    ["appointments", "teacher", teacherId] as const,
  studentAppointments: (studentId: string) =>
    ["appointments", "student", studentId] as const,
};
export const chatKeys = {
  conversations: ["chat", "conversations"] as const,
  messages: (conversationId: string) =>
    ["chat", "messages", conversationId] as const,
};
