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
  AppointmentService: Symbol.for("AppointmentService"),
  AppointmentController: Symbol.for("AppointmentController"),
  AppointmentQuery: Symbol.for("AppointmentQuery"),
  AppointmentCommand: Symbol.for("AppointmentCommand"),
<<<<<<< HEAD
  //review
  ReviewService: Symbol.for("ReviewService"),
  ReviewController: Symbol.for("ReviewController"),
  ReviewQuery: Symbol.for("ReviewQuery"),
  ReviewCommand: Symbol.for("ReviewCommand"),
=======
  //chat
  ChatService: Symbol.for("ChatService"),
  ChatQuery: Symbol.for("ChatQuery"),
  ChatCommand: Symbol.for("ChatCommand"),
  ChatController: Symbol.for("ChatController"),
  ConversationCommand: Symbol.for("ConversationCommand"),

  StreamController: Symbol.for("StreamController"),
>>>>>>> develop
};
