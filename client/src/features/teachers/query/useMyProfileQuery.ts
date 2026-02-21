import { useQuery } from "@tanstack/react-query";
import { getMyProfileApi } from "../../../api/teacher/teacher.api";
import { queryKeys } from "../../queryKeys";

export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.teachers.myProfile(),
    queryFn: getMyProfileApi,
    staleTime: 1000 * 60 * 5,
  });
};
