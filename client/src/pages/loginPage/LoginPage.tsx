import { LoginFinalType, Role } from "../../api/auth/types";
import { LoginForm } from "../../components/auth/loginForm/LoginForm";

export const LoginPage = ({ role }: { role: Role }) => {
  const onSubmit = (data: LoginFinalType) => {
    console.log(data);
  };

  return (
    <div className="auth-page">
      <LoginForm
        loading={false}
        onSubmit={onSubmit}
        title={role === "teacher" ? "LOGIN AS A TUTOR" : "LOGIN"}
        role={role}
      />
    </div>
  );
};
