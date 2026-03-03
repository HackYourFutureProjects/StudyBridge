import { LoginFinalType } from "../../api/auth/types.ts";
import { LoginForm } from "../../components/auth/loginForm/LoginForm.tsx";
import { useLoginModeratorMutation } from "../../features/moderator/mutation/useModeratorLogin.ts";

export const LoginModeratorPage = () => {
  const { mutateAsync, isPending } = useLoginModeratorMutation();

  const onSubmit = async (data: LoginFinalType) => {
    await mutateAsync({ ...data });
  };

  return (
    <div className="auth-page">
      <LoginForm
        loading={isPending}
        onSubmit={onSubmit}
        title="Moderator"
        role="moderator"
      />
    </div>
  );
};
