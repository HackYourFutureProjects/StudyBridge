import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyStudentProfile } from "../../../api/student/student.api";
import { UpdateStudentProfile } from "../../../api/student/student.type";
import { queryKeys } from "../../queryKeys";

export const useUpdateMyStudentProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentProfile) => updateMyStudentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myStudentProfile() });
    },
  });
};
