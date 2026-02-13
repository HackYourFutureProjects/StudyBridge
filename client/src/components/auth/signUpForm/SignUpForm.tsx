import { useForm } from "react-hook-form";
import type { FormValues } from "./signUpFormTypes.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledTextField } from "../../ui/controlled/controlledTextField/ControlledTextField";
import { Button } from "../../ui/button/Button";
import { signUpSchema } from "./signUpForm.validation";
import Google from "../../icons/Google";
import { NavLink } from "react-router-dom";
import { authRoutesVariables } from "../../../router/routesVariables/pathVariables";
import {
  RegisterFinalType,
  RegisterFormTypes,
  Role,
} from "../../../api/auth/types";

type SignUpFormTypes = {
  loading: boolean;
  title: string;
  role: Role;
  onSubmit: (data: RegisterFinalType) => Promise<void>;
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

  const onSubmitForm = async (data: RegisterFormTypes) => {
    try {
      await onSubmit({ ...data, role });
      reset();
    } catch {
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: "",
      });
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
            type="password"
          />
        </div>

        <div className="auth-actions">
          <div className="auth-actions-inner">
            <Button
              as={NavLink}
              to={
                role === "teacher"
                  ? authRoutesVariables.recoveryTeacher
                  : authRoutesVariables.recoveryStudent
              }
              variant="link"
              className="auth-link-underline self-center p-0"
              type="button"
            >
              Forgot Password?
            </Button>
            <Button
              variant="secondary"
              size="auth"
              type="submit"
              disabled={loading}
            >
              Sign Up
            </Button>
            <Button
              as={NavLink}
              to={
                role === "student"
                  ? authRoutesVariables.loginStudent
                  : authRoutesVariables.loginTutor
              }
              variant="tertiary"
              size="auth"
              type="button"
            >
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
