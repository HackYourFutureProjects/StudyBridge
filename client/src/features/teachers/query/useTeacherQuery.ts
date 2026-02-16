import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { getTeacherByIdApi } from "../../../api/teacher/teacher.api";

export const useTeacherQuery = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.teacher(teacherId),
    queryFn: () => getTeacherByIdApi(teacherId),
    enabled: !!teacherId,
  });
};
