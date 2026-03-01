import { useQuery } from "@tanstack/react-query";
import { getRegularTeachersApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";

export const useRegularTeachersQuery = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.regularTeachers(page, limit),
    queryFn: () => getRegularTeachersApi(page, limit),
  });
};
