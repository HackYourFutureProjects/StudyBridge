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
  root: "/chat",
  dialog: ":id",
};

export const studentPrivatesRoutesVariables = {
  dashboard: "/clients-dashboard",
  classes: "/student-classes",
  appointments: "/clients-appointments",
  billing: "/clients-billing",
};

export const teacherPrivatesRoutesVariables = {
  dashboard: "/teacher/my-dashboard",
  classes: "/teacher/my-classes",
  myStudents: "/teacher/my-students",
  billings: "/teacher/my-billings",
  profile: "/teacher/profile",
  appointments: "/teacher-appointments",
};
