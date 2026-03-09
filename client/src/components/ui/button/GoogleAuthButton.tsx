import { GoogleLogin } from "@react-oauth/google";
import { Intent, Role } from "../../../api/auth/types";
import { useGoogleLoginMutation } from "../../../features/auth/mutations/useGoogleMutation";
import { useLocation } from "react-router-dom";

type Props = {
  role: Role;
  intent: Intent;
  onClose?: () => void;
  className?: string;
};

export const GoogleAuthButton = ({
  role,
  intent,
  onClose,
  className,
}: Props) => {
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const { mutate } = useGoogleLoginMutation({
    role,
    intent,
    onClose,
    returnTo,
  });

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={(resp) => {
          const idToken = resp.credential;
          if (!idToken) {
            return;
          }
          mutate(idToken);
        }}
        useOneTap={false}
        theme="filled_black"
        size="large"
        shape="circle"
        text="continue_with"
      />
    </div>
  );
};
