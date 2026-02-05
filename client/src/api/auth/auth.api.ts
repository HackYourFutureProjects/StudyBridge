import axios from "axios";
import { RegisterFinalType } from "./types";

export async function registerStudentApi(data: RegisterFinalType) {
  await axios.post("/api/auth/registration-student", data);
}

export async function registerTeacherApi(data: RegisterFinalType) {
  await axios.post("/api/auth/registration-teacher", data);
}
