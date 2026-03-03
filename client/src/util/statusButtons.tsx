import { twMerge } from "tailwind-merge";
import { TeacherStatus } from "../api/teacher/teacher.type.ts";

export const statusUi: Record<
  TeacherStatus,
  { label: string; ring: string; bg: string; text: string }
> = {
  active: {
    label: "Active",
    ring: "border-blue-500",
    bg: "bg-blue-500",
    text: "text-white",
  },
  rejected: {
    label: "Rejected",
    ring: "border-red-500",
    bg: "bg-red-500",
    text: "text-white",
  },
  blocked: {
    label: "Blocked",
    ring: "border-amber-900",
    bg: "bg-amber-900",
    text: "text-white",
  },
  draft: {
    label: "Draft",
    ring: "border-yellow-400",
    bg: "bg-yellow-400",
    text: "text-dark-900",
  },
  pending: {
    label: "Pending",
    ring: "border-purple-400",
    bg: "bg-purple-400",
    text: "text-white",
  },
};
export const statusOptions: TeacherStatus[] = [
  "draft",
  "pending",
  "active",
  "rejected",
  "blocked",
];
export const getStatusButtonClass = (s: TeacherStatus, isActive: boolean) => {
  const ui = statusUi[s];

  const base = "min-h-8 px-4 py-1 rounded-full border-2 transition";

  const active = `${ui.bg} ${ui.text} ${ui.ring} shadow-sm`;

  const inactive = `bg-transparent ${ui.ring} text-light-100 hover:${ui.bg} hover:${ui.text}`;

  return twMerge(base, isActive ? active : inactive);
};
