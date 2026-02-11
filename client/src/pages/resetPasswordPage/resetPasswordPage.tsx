import { ResetPasswordForm } from "../../components/auth/resetPasswordForm/restPssswordForm.tsx";
import type { ResetPasswordFormValues } from "../../components/auth/resetPasswordForm/resetPasswordFromTypes.ts";

export const ResetPasswordPage = () => {
  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log(data);
  };

  return (
    <div className="auth-page">
      <ResetPasswordForm
        loading={false}
        onSubmit={onSubmit}
        title="Reset password"
      />
    </div>
  );
};
