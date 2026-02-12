import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "../../components/auth/resetPasswordForm/restPssswordForm.tsx";
import type { ResetPasswordFormValues } from "../../components/auth/resetPasswordForm/resetPasswordFromTypes.ts";
import { resetPasswordApi } from "../../api/auth/auth.api";
import { useNotificationStore } from "../../store/notification.store";
import { getErrorMessage } from "../../util/ErrorUtil";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

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
      success("Password has been reset successfully");
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
    await mutateAsync(data);
  };

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
