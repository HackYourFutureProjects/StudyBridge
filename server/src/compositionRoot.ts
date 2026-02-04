import "reflect-metadata";
import { Container } from "inversify";
import { StudentQuery } from "./repositories/queryRepositories/studentQuery.js";

export const container = new Container();

//student
container.bind(StudentQuery).toSelf();
