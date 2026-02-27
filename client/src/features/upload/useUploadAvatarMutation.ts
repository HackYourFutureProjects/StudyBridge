import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatarApi } from "../../api/upload/upload.api";
import { notifySuccess, notifyError } from "../../util/notification.util";
import { queryKeys } from "../queryKeys";

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatarApi(file),
    onSuccess: async () => {
      notifySuccess("Avatar uploaded successfully");

      await queryClient.refetchQueries({
        queryKey: queryKeys.students.myProfile(),
      });
      await queryClient.refetchQueries({
        queryKey: queryKeys.teachers.myProfile(),
      });
      await queryClient.refetchQueries({ queryKey: queryKeys.me });
    },
    onError: () => {
      notifyError("Failed to upload avatar");
    },
  });
};
