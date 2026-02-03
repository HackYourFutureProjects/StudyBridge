import { useForm } from "react-hook-form";
import type { FormValues } from "./signUpFormTypes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledTextField } from "../../ui/controlled/controlledTextField/ControlledTextField";
import { Button } from "../../ui/button/Button";
import { signUpSchema } from "./signUpForm.validation";
import { Role, SignUpData } from "../types";
import Google from "../../icons/Google";

type SignUpFormTypes = {
  loading: boolean;
  title: string;
  role: Role;
  onSubmit: (data: SignUpData & { role: Role }) => void;
};

export const SignUpForm = ({
  loading,
  onSubmit,
  title,
  role,
}: SignUpFormTypes) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmitForm = (data: SignUpData) => {
    onSubmit({ ...data, role });
    reset();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
      <h1 className="auth-title">{title}</h1>
      <h3 className="auth-subtitle">
        Welcome back! Please log in to access your account.
      </h3>

      <div className="auth-content">
        <div className="auth-fields">
          <ControlledTextField
            placeholder="Enter First Name"
            control={control}
            name="firstName"
          />
          <ControlledTextField
            placeholder="Enter Last Name"
            control={control}
            name="lastName"
          />
          <ControlledTextField
            placeholder="Enter your Email"
            control={control}
            name="email"
          />
          <ControlledTextField
            placeholder="Enter your Password"
            control={control}
            name="password"
          />
        </div>

        <div className="auth-actions">
          <div className="auth-actions-inner">
            <Button
              variant="link"
              className="auth-link-underline self-center p-0"
              type="button"
            >
              Forgot Password?
            </Button>
            <Button variant="secondary" size="auth" type="submit">
              Sign Up
            </Button>
            <Button variant="tertiary" size="auth" type="button">
              Sign In
            </Button>
          </div>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Or Continue with</span>
            <div className="auth-divider-line" />
          </div>

          <Button variant="link" type="button">
            <Google />
          </Button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
    </form>
  );
};
