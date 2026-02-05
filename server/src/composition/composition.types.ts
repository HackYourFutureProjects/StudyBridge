export const TYPES = {
  //student
  StudentCommand: Symbol.for("StudentCommand"),
  StudentService: Symbol.for("StudentService"),
  StudentQuery: Symbol.for("StudentQuery"),

  //teacher
  TeacherCommand: Symbol.for("TeacherCommand"),
  TeacherService: Symbol.for("TeacherService"),
  TeacherQuery: Symbol.for("TeacherQuery"),
  TeacherController: Symbol.for("TeacherController"),
  //jwt
  JwtService: Symbol.for("JwtService"),
  //middlewares
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  //auth
  AuthController: Symbol.for("AuthController"),
};
