import { SignUpForm } from "../../components/auth/signUpForm/SignUpForm";
import { RegisterFinalType, Role } from "../../api/auth/types";
import { useRegisterMutation } from "../../features/auth/mutations/useRegisterMutation";

export const SignUpPage = ({ role }: { role: Role }) => {
  const { mutateAsync, isPending } = useRegisterMutation(role);

  const onSubmit = (data: RegisterFinalType) => {
    mutateAsync({ ...data, role });
  };

  return (
    <div className="auth-page">
      <SignUpForm
        loading={isPending}
        onSubmit={onSubmit}
        title={role === "teacher" ? "SIGN UP AS A TUTOR" : "SIGN UP"}
        role={role}
      />
    </div>
  );
};
