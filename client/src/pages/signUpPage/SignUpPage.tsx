import type { Role } from "../../components/auth/types.ts";
import { SignUpForm } from "../../components/auth/signUpForm/SignUpForm";

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const SignUpPage = ({ role }: { role: Role }) => {
  const onSubmit = (data: SignUpData & { role: Role }) => {
    console.log({ ...data, role });
  };

  return (
    <div className="auth-page">
      <SignUpForm
        loading={false}
        onSubmit={onSubmit}
        title={role === "tutor" ? "SIGN UP AS A TUTOR" : "SIGN UP"}
        role={role}
      />
    </div>
  );
};
