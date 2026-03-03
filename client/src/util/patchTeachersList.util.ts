import {
  TeacherOutputModel,
  TeacherStatus,
} from "../api/teacher/teacher.type.ts";

export const patchTeacherInList = (
  data: TeacherOutputModel,
  id: string,
  status: TeacherStatus,
): TeacherOutputModel => ({
  ...data,
  items: data.items.map((t) => (t.id === id ? { ...t, status } : t)),
});

export const patchPublicList = (
  data: TeacherOutputModel,
  id: string,
  status: TeacherStatus,
): TeacherOutputModel => {
  if (status !== "active") {
    return { ...data, items: data.items.filter((t) => t.id !== id) };
  }
  return patchTeacherInList(data, id, status);
};
