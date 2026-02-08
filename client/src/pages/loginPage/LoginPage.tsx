import { LoginFinalType, Role } from "../../api/auth/types";
import { LoginForm } from "../../components/auth/loginForm/LoginForm";
import { useLoginMutation } from "../../features/auth/mutations/useLoginMutation";

export const LoginPage = ({ role }: { role: Role }) => {
  const { mutateAsync, isPending } = useLoginMutation(role);

  const onSubmit = (data: LoginFinalType) => {
    mutateAsync(data);
  };

  return (
    <div className="auth-page">
      <LoginForm
        loading={isPending}
        onSubmit={onSubmit}
        title={role === "teacher" ? "LOGIN AS A TUTOR" : "LOGIN"}
        role={role}
      />
    </div>
  );
};
