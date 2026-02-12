import { RecoveryForm } from "../../components/auth/recoveryForm/RecoveryForm.tsx";

export type RecoveryDataType = {
  email: string;
};

export const RecoveryPage = () => {
  const onSubmit = (data: RecoveryDataType) => {
    console.log(data);
  };

  return (
    <div className="auth-page">
      <RecoveryForm
        loading={false}
        onSubmit={onSubmit}
        title="Reset password"
      />
    </div>
  );
};
