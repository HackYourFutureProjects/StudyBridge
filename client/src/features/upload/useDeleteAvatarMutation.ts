import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAvatarApi } from "../../api/upload/upload.api";
import { notifySuccess, notifyError } from "../../util/notification.util";
import { queryKeys } from "../queryKeys";

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAvatarApi(),
    onSuccess: () => {
      notifySuccess("Avatar deleted successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.teachers.myProfile(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.students.myProfile(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: () => {
      notifyError("Failed to delete avatar");
    },
  });
};
