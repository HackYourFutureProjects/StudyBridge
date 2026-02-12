import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledTextField } from "../../ui/controlled/controlledTextField/ControlledTextField.tsx";
import { Button } from "../../ui/button/Button.tsx";
import type { ResetPasswordFormValues } from "./resetPasswordFromTypes.ts";
import { resetPasswordSchema } from "./resetPassword.validation.ts";

type ResetPasswordFormProps = {
  loading: boolean;
  title: string;
  onSubmit: (data: ResetPasswordFormValues) => Promise<void> | void;
};

export const ResetPasswordForm = ({
  loading,
  onSubmit,
  title,
}: ResetPasswordFormProps) => {
  const { control, handleSubmit, reset } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitForm = async (data: ResetPasswordFormValues) => {
    try {
      await onSubmit(data);
      reset();
    } catch {
      // keep form values on submit error; page handles toast
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
      <h1 className="auth-title">{title}</h1>
      <h3 className="auth-subtitle">Please enter your new password.</h3>

      <div className="auth-content">
        <div className="auth-fields">
          <ControlledTextField
            placeholder="New password"
            control={control}
            name="newPassword"
            type="password"
          />
          <ControlledTextField
            placeholder="Confirm new password"
            control={control}
            name="confirmPassword"
            type="password"
          />
        </div>

        <div className="auth-actions">
          <div className="auth-actions-inner">
            <Button variant="secondary" size="auth" type="submit">
              Reset Password
            </Button>
          </div>
        </div>
      </div>

      {loading && <div>Loading...</div>}
    </form>
  );
};
