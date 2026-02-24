import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerApi } from "../../../api/auth/auth.api";
import { queryKeys } from "../../queryKeys";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { RegisterFinalType, Role } from "../../../api/auth/types";
import { useNotificationStore } from "../../../store/notification.store";

export const useRegisterMutation = (role: Role) => {
  const qc = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: (data: RegisterFinalType) => registerApi(data),
    onSuccess: async () => {
      if (role === "teacher") {
        await qc.invalidateQueries({ queryKey: queryKeys.teachers.all });
      } else {
        await qc.invalidateQueries({ queryKey: queryKeys.students.all });
      }
      success("Successfully registered");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
};
