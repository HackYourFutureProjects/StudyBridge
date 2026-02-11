import { RecoveryForm } from "../../components/auth/recoveryForm/RecoveryForm.tsx";
import {
  requestPasswordResetStudentApi,
  requestPasswordResetTeacherApi,
} from "../../api/auth/auth.api";

export type RecoveryDataType = {
  email: string;
};

type RecoveryPageProps = { role: "student" | "teacher" };

export const RecoveryPage = ({ role }: RecoveryPageProps) => {
  const onSubmit = async (data: RecoveryDataType) => {
    // console.log(data);
    if (role === "student") {
      await requestPasswordResetStudentApi(data);
    } else {
      await requestPasswordResetTeacherApi(data);
    }
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
