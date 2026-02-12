import { useMutation } from "@tanstack/react-query";
import { RecoveryForm } from "../../components/auth/recoveryForm/RecoveryForm.tsx";
import {
  requestPasswordResetStudentApi,
  requestPasswordResetTeacherApi,
} from "../../api/auth/auth.api";
import { useNotificationStore } from "../../store/notification.store";
import { getErrorMessage } from "../../util/ErrorUtil";

type RecoveryDataType = { email: string };
type RecoveryPageProps = { role: "student" | "teacher" };

export const RecoveryPage = ({ role }: RecoveryPageProps) => {
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: RecoveryDataType) =>
      role === "teacher"
        ? requestPasswordResetTeacherApi(data)
        : requestPasswordResetStudentApi(data),
    onSuccess: () => {
      success("If an account exists for this email, a reset link was sent");
    },
    onError: (error) => {
      notifyError(getErrorMessage(error));
    },
  });

  return (
    <div className="auth-page">
      <RecoveryForm
        loading={isPending}
        onSubmit={mutateAsync}
        title="Reset password"
      />
    </div>
  );
};
