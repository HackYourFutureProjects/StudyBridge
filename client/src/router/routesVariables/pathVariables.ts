export const studentBase = "/clients-dashboard";
export const teacherBase = "/teacher";
export const moderatorBase = "/moderator";

export const publicRoutesVariables = {
  home: "/",
  teachers: "/teachers",
  teacher: "/teacher/:id",
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  returnPolicy: "/return-policy",
};

export const authRoutesVariables = {
  loginStudent: "/login/student",
  loginTutor: "/login/tutor",
  registerStudent: "/register/student",
  registerTutor: "/register/tutor",

  recoveryStudent: "/recovery/student",
  recoveryTeacher: "/recovery/teacher",

  resetPassword: "/reset-password",
  loginModerator: "/login/moderator",
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
  profile: "profile",
};

export const teacherPrivatesRoutesVariables = {
  dashboard: "my-dashboard",
  classes: "my-classes",
  myStudents: "my-students",
  billings: "my-billings",
  profile: "profile",
  appointments: "teacher-appointments",
};

export const moderatorPrivatesRoutesVariables = {
  teachers: "teachers",
  teacher: "teachers/:id",
};
