import mongoose from "mongoose";
import { WithId } from "mongodb";
import { SchemaDb } from "./types/subjects.types.js";

const SubjectsSchema = new mongoose.Schema<SchemaDb>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
  },
  { versionKey: false },
);
export const SubjectsModel = mongoose.model<WithId<SchemaDb>>(
  "subjects",
  SubjectsSchema,
);
