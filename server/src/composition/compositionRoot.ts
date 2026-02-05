import "reflect-metadata";
import { Container } from "inversify";
import { StudentQuery } from "../repositories/queryRepositories/student.query.js";
import { StudentService } from "../services/student/student.service.js";
import { TYPES } from "./composition.types.js";
import { StudentCommand } from "../repositories/commandRepositories/student.command.js";
import { AuthController } from "../controllers/auth.controller.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherCommand } from "../repositories/commandRepositories/teacher.command.js";

export const container = new Container();

//auth
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// student
container.bind<StudentCommand>(TYPES.StudentCommand).to(StudentCommand);
container.bind<StudentQuery>(TYPES.StudentQuery).to(StudentQuery);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);

// teacher
container.bind<TeacherCommand>(TYPES.TeacherCommand).to(TeacherCommand);
container.bind<TeacherQuery>(TYPES.TeacherQuery).to(TeacherQuery);
container.bind<TeacherService>(TYPES.TeacherService).to(TeacherService);
