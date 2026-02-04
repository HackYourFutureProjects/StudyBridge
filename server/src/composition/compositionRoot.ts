import "reflect-metadata";
import { Container } from "inversify";
import { StudentQuery } from "../repositories/queryRepositories/student.query.js";
import { StudentService } from "../services/student/student.service.js";
import { TYPES } from "./composition.types.js";
import { StudentCommand } from "../repositories/commandRepositories/student.command.js";
import { AuthController } from "../controllers/auth.controller.js";

export const container = new Container();

//auth
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

//student
container.bind<StudentCommand>(TYPES.StudentCommand).to(StudentCommand);
container.bind<StudentService>(TYPES.StudentService).to(StudentService);
container.bind<StudentQuery>(TYPES.StudentService).to(StudentQuery);
