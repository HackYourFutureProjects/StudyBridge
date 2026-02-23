import "reflect-metadata";
import { Container } from "inversify";
import { StudentQuery } from "../repositories/queryRepositories/student.query.js";
import { StudentService } from "../services/student/student.service.js";
import { TYPES } from "./composition.types.js";
import { StudentCommand } from "../repositories/commandRepositories/student.command.js";
import { StudentController } from "../controllers/student.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherCommand } from "../repositories/commandRepositories/teacher.command.js";
import { TeacherController } from "../controllers/teacher.controller.js";
import { JwtService } from "../services/jwt/jwt.service.js";
import { AuthMiddleware } from "../middlewares/authMiddlewareWithBearer.js";
import { AuthService } from "../services/auth/auth.service.js";
import { RefreshSessionRepository } from "../repositories/commandRepositories/refreshSession.repository.js";
import { RefreshTokenMiddleware } from "../middlewares/refreshToken.middleware.js";
import { AppointmentService } from "../services/appointment/appointment.service.js";
import { AppointmentController } from "../controllers/appointment.controller.js";
import { AppointmentCommand } from "../repositories/commandRepositories/appointment.command.js";
import { AppointmentQuery } from "../repositories/queryRepositories/appointment.query.js";
import { ChatQuery } from "../repositories/queryRepositories/chat.query.js";
import { ChatCommand } from "../repositories/commandRepositories/chat.command.js";
import { ChatController } from "../controllers/chat.controller.js";
import { ChatService } from "../services/chat/chat.service.js";
import { ConversationCommand } from "../repositories/commandRepositories/conversation.command.js";
import { StreamController } from "../controllers/stream.controller.js";
import { VideoCallCommand } from "../repositories/commandRepositories/videoCall.command.js";
import { VideoCallController } from "../controllers/videoCall.controller.js";
import { VideoCallQuery } from "../repositories/queryRepositories/videoCall.query.js";
import { VideoCallService } from "../services/video/videoCall.service.js";

export const container = new Container();

//auth
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
//jwt
container.bind<JwtService>(TYPES.JwtService).to(JwtService);
//refresh
container
  .bind<RefreshSessionRepository>(TYPES.RefreshSessionRepository)
  .to(RefreshSessionRepository);
//middleware
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container
  .bind<RefreshTokenMiddleware>(TYPES.RefreshTokenMiddleware)
  .to(RefreshTokenMiddleware);

// student
container.bind<StudentCommand>(TYPES.StudentCommand).to(StudentCommand);
container.bind<StudentQuery>(TYPES.StudentQuery).to(StudentQuery);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);
container
  .bind<StudentController>(TYPES.StudentController)
  .to(StudentController);

// teacher
container.bind<TeacherCommand>(TYPES.TeacherCommand).to(TeacherCommand);
container.bind<TeacherQuery>(TYPES.TeacherQuery).to(TeacherQuery);
container.bind<TeacherService>(TYPES.TeacherService).to(TeacherService);
container
  .bind<TeacherController>(TYPES.TeacherController)
  .to(TeacherController);

// appointment
container
  .bind<AppointmentService>(TYPES.AppointmentService)
  .to(AppointmentService);
container
  .bind<AppointmentController>(TYPES.AppointmentController)
  .to(AppointmentController);
container.bind<AppointmentQuery>(TYPES.AppointmentQuery).to(AppointmentQuery);
container
  .bind<AppointmentCommand>(TYPES.AppointmentCommand)
  .to(AppointmentCommand);

//chat
container.bind(TYPES.ChatService).to(ChatService);
container.bind(TYPES.ChatQuery).to(ChatQuery);
container.bind(TYPES.ChatCommand).to(ChatCommand);
container.bind(TYPES.ChatController).to(ChatController);
container.bind(TYPES.ConversationCommand).to(ConversationCommand);

//video call
container.bind<StreamController>(TYPES.StreamController).to(StreamController);
container.bind<VideoCallService>(TYPES.VideoCallService).to(VideoCallService);
container
  .bind<VideoCallController>(TYPES.VideoCallController)
  .to(VideoCallController);
container.bind<VideoCallQuery>(TYPES.VideoCallQuery).to(VideoCallQuery);
container.bind<VideoCallCommand>(TYPES.VideoCallCommand).to(VideoCallCommand);
