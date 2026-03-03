import { apiProtected, apiPublic } from "../api.ts";
import {
  TeacherOutputModel,
  TeachersForModeratorQuery,
  TeachersQuery,
  TeacherType,
  UpdateTeacherProfileInput,
} from "./teacher.type.ts";

export async function getAllTeachersApi(query: TeachersQuery) {
  const res = await apiPublic.get<TeacherOutputModel>("/api/teachers", {
    params: query,
  });

  return res.data;
}

export async function getAllTeachersForModeratorApi(
  query: TeachersForModeratorQuery,
) {
  const res = await apiProtected.get<TeacherOutputModel>(
    "/api/teachers/get-teachers-moderator",
    {
      params: query,
    },
  );

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

export async function getMyWeeklyScheduleApi() {
  const res = await apiProtected.get<ApiAvailability>(
    "/api/teachers/me/schedule/week",
  );
  return res.data;
}

export async function getMyProfileApi() {
  const res = await apiProtected.get<TeacherType>("/api/teachers/me");
  return res.data;
}

export async function updateMyProfileApi(data: UpdateTeacherProfileInput) {
  const res = await apiProtected.put<TeacherType>("/api/teachers/me", data);
  return res.data;
}
