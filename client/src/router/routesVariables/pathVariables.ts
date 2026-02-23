export const studentBase = "/clients-dashboard";
export const teacherBase = "/teacher";

export const publicRoutesVariables = {
  home: "/",
  teachers: "/teachers",
  teacher: "/teacher/:id",
};

export const authRoutesVariables = {
  loginStudent: "/login/student",
  loginTutor: "/login/tutor",
  registerStudent: "/register/student",
  registerTutor: "/register/tutor",

  recoveryStudent: "/recovery/student",
  recoveryTeacher: "/recovery/teacher",

  resetPassword: "/reset-password",
};

export const chatRoutes = {
  root: "chat",
  dialog: ":id",
};

export const studentPrivatesRoutesVariables = {
  dashboard: "",
  classes: "student-classes",
  appointments: "clients-appointments",
  billing: "clients-billing",
};

export const teacherPrivatesRoutesVariables = {
  dashboard: "my-dashboard",
  classes: "my-classes",
  myStudents: "my-students",
  billings: "my-billings",
  profile: "profile",
  appointments: "teacher-appointments",
};
