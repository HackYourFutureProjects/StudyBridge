import { useForm } from "react-hook-form";
import type { FormValues } from "./loginFormTypes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFinalType, LoginFormTypes, Role } from "../../../api/auth/types";
import Google from "../../icons/Google";
import { loginSchema } from "./loginForm.validation";
import { ControlledTextField } from "../../ui/controlled/controlledTextField/ControlledTextField";
import { Button } from "../../ui/button/Button";
import { NavLink } from "react-router-dom";
import { authRoutesVariables } from "../../../router/routesVariables/pathVariables";

type LoginFormComponentTypes = {
  loading: boolean;
  title: string;
  role: Role;
  onSubmit: (data: LoginFinalType) => Promise<void>;
};

export const LoginForm = ({
  loading,
  onSubmit,
  title,
  role,
}: LoginFormComponentTypes) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitForm = async (data: LoginFormTypes) => {
    try {
      await onSubmit({ ...data, role });
      reset({ email: data.email, password: "" });
    } catch {
      // error is handled by react-query onError (toast), keep form values
    }
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
            placeholder="Enter your Email"
            control={control}
            name="email"
          />
          <ControlledTextField
            placeholder="Enter your password"
            control={control}
            name="password"
            type="password"
          />
        </div>

        <div className="auth-actions">
          <div className="auth-actions-inner">
            <Button
              as={NavLink}
              variant="link"
              to={
                role === "teacher"
                  ? authRoutesVariables.recoveryTeacher
                  : authRoutesVariables.recoveryStudent
              }
              className="auth-link-underline"
              type="button"
            >
              Forgot Password?
            </Button>
            <Button variant="secondary" size="auth" type="submit">
              Sign In
            </Button>
            <Button
              as={NavLink}
              to={
                role === "teacher"
                  ? authRoutesVariables.registerTutor
                  : authRoutesVariables.registerStudent
              }
              variant="tertiary"
              size="auth"
              type="button"
            >
              Sign Up
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
