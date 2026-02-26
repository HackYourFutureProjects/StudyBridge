import { Router } from "express";
import { container } from "../composition/compositionRoot.js";
import { SubjectsController } from "../controllers/subjects.controller.js";
import { TYPES } from "../composition/composition.types.js";

export const subjectRouter = Router();
const subjectsController = container.get<SubjectsController>(
  TYPES.SubjectsController,
);

subjectRouter.get("/", subjectsController.getSubjects.bind(subjectsController));
