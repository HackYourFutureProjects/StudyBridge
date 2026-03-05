import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyStudentProfile } from "../../../api/student/student.api";
import { UpdateStudentProfile } from "../../../api/student/student.type";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";

export const useUpdateMyStudentProfileMutation = () => {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);

  return useMutation({
    mutationFn: (data: UpdateStudentProfile) => updateMyStudentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.myProfile(),
      });
      success("Profile updated successfully!");
    },
  });
};
