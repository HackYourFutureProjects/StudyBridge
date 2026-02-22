import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfileApi } from "../../../api/teacher/teacher.api";
import { UpdateTeacherProfileInput } from "../../../api/teacher/teacher.type";
import { queryKeys } from "../../queryKeys";

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherProfileInput) => updateMyProfileApi(data),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teachers.myProfile(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacher(updatedTeacher.id),
      });
    },
  });
};
