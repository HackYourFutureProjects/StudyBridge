import { useQuery } from "@tanstack/react-query";
import { getMyStudentProfile } from "../../../api/student/student.api";
import { queryKeys } from "../../queryKeys";

export const useMyStudentProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.myStudentProfile(),
    queryFn: getMyStudentProfile,
  });
};
