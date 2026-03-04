import { Option } from "../components/ui/select/Select.tsx";
import {
  SortByTeachersForModerator,
  TeacherStatusQuery,
} from "../api/teacher/teacher.type.ts";

export const sortByOptions: Option<SortByTeachersForModerator>[] = [
  { label: "CreatedAt", value: "createdAt" },
  { label: "Status", value: "status" },
];

export const sortByStatus: Option<TeacherStatusQuery>[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Blocked", value: "blocked" },
];
