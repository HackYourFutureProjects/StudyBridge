import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "../../components/auth/resetPasswordForm/restPssswordForm.tsx";
import type { ResetPasswordFormValues } from "../../components/auth/resetPasswordForm/resetPasswordFromTypes.ts";
import { resetPasswordApi } from "../../api/auth/auth.api";
import { useNotificationStore } from "../../store/notification.store";
import { getErrorMessage } from "../../util/ErrorUtil";
import { authRoutesVariables } from "../../router/routesVariables/pathVariables";
import { useAuthSessionStore } from "../../store/authSession.store";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const role = searchParams.get("role");
  const isTeacher = role === "teacher";
  const isRoleValid = role === "student" || role === "teacher";

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthSessionStore((s) => s.clearSession);

  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      resetPasswordApi({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      clearSession();
      localStorage.removeItem("hadSession");
      queryClient.clear();
      success("Password has been reset successfully");

      const loginPath = isTeacher
        ? authRoutesVariables.loginTutor
        : authRoutesVariables.loginStudent;

      navigate(loginPath, { replace: true });
    },
    onError: (error) => {
      notifyError(getErrorMessage(error));
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      notifyError("Reset token is missing");
      return;
    }

    if (!isRoleValid) {
      notifyError("Invalid reset link");
      return;
    }

    await mutateAsync(data);
  };

  if (!isRoleValid) {
    return <p>Invalid reset link.</p>;
  }

  return (
    <div className="auth-page">
      <ResetPasswordForm
        loading={isPending}
        onSubmit={onSubmit}
        title="Reset password"
      />
    </div>
  );
};
