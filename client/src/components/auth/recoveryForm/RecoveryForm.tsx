import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledTextField } from "../../ui/controlled/controlledTextField/ControlledTextField.tsx";
import { Button } from "../../ui/button/Button.tsx";
import type { FormValues } from "./recoveryFormTypes.ts";
import { recoverySchema } from "./recoveryForm.validation.ts";
import { Loader } from "../../loader/Loader.tsx";

type RecoveryFormProps = {
  loading: boolean;
  title: string;
  onSubmit: (data: FormValues) => Promise<void> | void;
};

export const RecoveryForm = ({
  loading,
  onSubmit,
  title,
}: RecoveryFormProps) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitForm = async (data: FormValues) => {
    try {
      await onSubmit(data);
      reset(); // only on success
    } catch {
      // keep form values on submit error
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
      <h1 className="auth-title">{title}</h1>
      <h3 className="auth-subtitle">
        Welcome back! Please recover your password.
      </h3>

      <div className="auth-content">
        <div className="auth-fields">
          <ControlledTextField
            placeholder="Enter your Email"
            control={control}
            name="email"
          />
        </div>

        <div className="auth-actions">
          <div className="auth-actions-inner">
            <Button variant="secondary" size="auth" type="submit">
              Send
            </Button>
          </div>
        </div>
      </div>

      {loading && <Loader />}
    </form>
  );
};
