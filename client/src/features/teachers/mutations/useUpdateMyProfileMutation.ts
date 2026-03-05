import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfileApi } from "../../../api/teacher/teacher.api";
import { UpdateTeacherProfileInput } from "../../../api/teacher/teacher.type";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);

  return useMutation({
    mutationFn: (data: UpdateTeacherProfileInput) => updateMyProfileApi(data),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.teachers.myProfile(),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all });

      queryClient.invalidateQueries({
        queryKey: queryKeys.teacherPublic(updatedTeacher.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacherModerator(updatedTeacher.id),
      });
      success("Profile updated successfully!");
    },
  });
};
