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
import { VerifyMiddleware } from "../middlewares/verifyToken.middleware.js";
import { RefreshSessionRepository } from "../repositories/commandRepositories/refreshSession.repository.js";

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
container.bind<VerifyMiddleware>(TYPES.VerifyMiddleware).to(VerifyMiddleware);

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
