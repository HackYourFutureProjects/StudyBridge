import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { loginStudentApi, loginTeacherApi } from "../../../api/auth/auth.api";
import { queryKeys } from "../../queryKeys";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { LoginFinalType, Role } from "../../../api/auth/types";

export function useLoginMutation(role: Role) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const mutationFn = (data: LoginFinalType) => {
    return role === "teacher" ? loginTeacherApi(data) : loginStudentApi(data);
  };

  return useMutation({
    mutationFn,
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      localStorage.setItem("hadSession", "1");
      navigate("/", { replace: true });
      await qc.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      console.log(msg);
    },
  });
}
