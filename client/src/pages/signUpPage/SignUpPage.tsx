import { SignUpForm } from "../../components/auth/signUpForm/SignUpForm";
import { RegisterFinalType, Role } from "../../api/auth/types";

export const SignUpPage = ({ role }: { role: Role }) => {
  const onSubmit = (data: RegisterFinalType) => {
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
