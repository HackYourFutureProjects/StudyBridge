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
  // recovery: "/recovery",
  recoveryStudent: "/recovery/student",
  recoveryTeacher: "/recovery/teacher",

  resetPassword: "/reset-password",
};

export const privatesRoutesVariables = {
  dashboard: "/dashboard",
  appointments: "/appointments",
};
