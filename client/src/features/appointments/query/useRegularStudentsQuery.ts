import { useQuery } from "@tanstack/react-query";
import { getRegularStudentsApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";

export const useRegularStudentsQuery = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.regularStudents(page, limit),
    queryFn: () => getRegularStudentsApi(page, limit),
  });
};
