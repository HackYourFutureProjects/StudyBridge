import {
  TeachersForModeratorQuery,
  TeachersQuery,
} from "../api/teacher/teacher.type.ts";

export const queryKeys = {
  me: ["auth", "me"] as const,

  students: {
    all: ["students"] as const,
    myProfile: () => ["students", "me"] as const,
  },
  teachers: {
    all: ["teachers"] as const,
    myProfile: () => ["teachers", "me"] as const,
    publicList: (params: TeachersQuery) =>
      ["teachers", "publicList", params] as const,

    moderatorList: (params: TeachersForModeratorQuery) =>
      ["teachers", "moderatorList", params] as const,
  },

  teacherPublic: (id: string) => ["teachers", "publicDetail", id] as const,
  teacherModerator: (id: string) =>
    ["teachers", "moderatorDetail", id] as const,

  appointments: ["appointments"] as const,
  teacherAppointments: (teacherId: string, page?: number, limit?: number) =>
    ["appointments", "teacher", teacherId, page, limit] as const,
  studentAppointments: (studentId: string, page?: number, limit?: number) =>
    ["appointments", "student", studentId, page, limit] as const,
  regularStudents: (page?: number, limit?: number) =>
    ["appointments", "regularStudents", page, limit] as const,
  regularTeachers: (page?: number, limit?: number) =>
    ["appointments", "regularTeachers", page, limit] as const,

  // Reviews
  reviews: (teacherId: string, page?: number, limit?: number) =>
    ["reviews", teacherId, page, limit] as const,
  reviewAverageRating: (teacherId: string) =>
    ["reviews", "averageRating", teacherId] as const,
};
export const chatKeys = {
  conversations: ["chat", "conversations"] as const,
  messages: (conversationId: string) =>
    ["chat", "messages", conversationId] as const,
};

export const subjectsKey = {
  all: ["subjects"] as const,
};
