import { LoginFinalType, Role } from "../../api/auth/types";
import { LoginForm } from "../../components/auth/loginForm/LoginForm";
import { useLoginMutation } from "../../features/auth/mutations/useLoginMutation";
import { useLocation } from "react-router-dom";

export const LoginPage = ({ role }: { role: Role }) => {
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const { mutateAsync, isPending } = useLoginMutation(returnTo);

  const onSubmit = async (data: LoginFinalType) => {
    await mutateAsync({ ...data, role });
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
