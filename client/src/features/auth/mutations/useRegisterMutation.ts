import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerStudentApi,
  registerTeacherApi,
} from "../../../api/auth/auth.api";
import { queryKeys } from "../../queryKeys";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { RegisterFinalType, Role } from "../../../api/auth/types";

export const useRegisterMutation = (role: Role) => {
  const qc = useQueryClient();

  const mutationFn = (data: RegisterFinalType) => {
    return role === "teacher"
      ? registerTeacherApi(data)
      : registerStudentApi(data);
  };

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      if (role === "teacher") {
        await qc.invalidateQueries({ queryKey: queryKeys.teachers });
      } else {
        await qc.invalidateQueries({ queryKey: queryKeys.students });
      }
      console.log("RegisterStudentMutation done2");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      console.log(msg);
    },
  });
};
