export const TYPES = {
  //student
  StudentCommand: Symbol.for("StudentCommand"),
  StudentService: Symbol.for("StudentService"),
  StudentQuery: Symbol.for("StudentQuery"),
  StudentController: Symbol.for("StudentController"),

  //teacher
  TeacherCommand: Symbol.for("TeacherCommand"),
  TeacherService: Symbol.for("TeacherService"),
  TeacherQuery: Symbol.for("TeacherQuery"),
  TeacherController: Symbol.for("TeacherController"),
  //jwt
  JwtService: Symbol.for("JwtService"),
  //middlewares
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  RefreshTokenMiddleware: Symbol.for("RefreshTokenMiddleware"),
  //auth
  AuthController: Symbol.for("AuthController"),
  AuthService: Symbol.for("AuthService"),
  //refresh
  RefreshSessionRepository: Symbol.for("RefreshSessionRepository"),
  //appointment
  AppointmentRepository: Symbol.for("AppointmentRepository"),
  AppointmentService: Symbol.for("AppointmentService"),
};
