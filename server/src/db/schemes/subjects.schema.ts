import mongoose from "mongoose";
import { WithId } from "mongodb";
import { SubjectsTypeDB } from "./types/subjects.types.js";

const SubjectsSchema = new mongoose.Schema<SubjectsTypeDB>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
  },
  { versionKey: false },
);
export const SubjectsModel = mongoose.model<WithId<SubjectsTypeDB>>(
  "subjects",
  SubjectsSchema,
);
