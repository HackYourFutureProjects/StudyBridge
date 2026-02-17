import { apiProtected, apiPublic } from "../api.ts";
import {
  TeacherOutputModel,
  TeachersQuery,
  TeacherType,
} from "./teacher.type.ts";

export async function getAllTeachersApi(query: TeachersQuery) {
  const res = await apiPublic.get<TeacherOutputModel>("/api/teachers", {
    params: query,
  });

  return res.data;
}

export async function getTeacherByIdApi(teacherId: string) {
  const res = await apiPublic.get<TeacherType>(`/api/teachers/${teacherId}`);
  return res.data;
}

type ApiSlot = { start: string; end: string };
type ApiAvailability = {
  monday: ApiSlot[];
  tuesday: ApiSlot[];
  wednesday: ApiSlot[];
  thursday: ApiSlot[];
  friday: ApiSlot[];
  saturday: ApiSlot[];
  sunday: ApiSlot[];
};

// sends the teacher's weekly availability to the backend and replaces the stored week.
export async function updateMyWeeklyScheduleApi(payload: {
  availability: ApiAvailability;
  timezone?: string;
}) {
  const res = await apiProtected.put<ApiAvailability>(
    "/api/teachers/me/schedule/week",
    payload,
  );
  return res.data;
}

// requests the teacher's saved weekly availability from the backend for UI prefill/highlighting
export async function getMyWeeklyScheduleApi() {
  const res = await apiProtected.get<ApiAvailability>(
    "/api/teachers/me/schedule/week",
  );
  return res.data;
}
