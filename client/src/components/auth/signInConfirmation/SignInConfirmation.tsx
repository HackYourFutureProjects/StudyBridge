import React from "react";
import { useNavigate } from "react-router-dom";
import { authRoutesVariables } from "../../../router/routesVariables/pathVariables";
import SignInIcon from "../../icons/SignInIcon";
import Cross from "../../icons/Cross";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInConfirmation: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate(authRoutesVariables.loginStudent);
  };

  if (!isOpen) return null;

  return (
    <div className="relative mx-4 h-[240px] w-[90vw] max-w-[556px] rounded-2xl bg-white p-5 shadow-xl sm:h-[263px] sm:p-6">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-colors hover:bg-gray-50 sm:right-4 sm:top-4 sm:h-12 sm:w-12"
        aria-label="Close"
      >
        <Cross className="h-4 w-4 text-[#344054] sm:h-5 sm:w-5" />
      </button>

      <div className="flex h-full flex-col items-center justify-center gap-5 pt-2 sm:gap-6">
        <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px]">
          <div className="absolute inset-0 rounded-full bg-[#F4EBFF]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <SignInIcon
              width={32}
              height={32}
              className="text-[#6779E3] sm:h-9 sm:w-9"
              style={{ color: "#6779E3" }}
            />
          </div>
        </div>

        <h2 className="text-center text-[28px] font-semibold leading-[36px] tracking-[-0.56px] text-[#101828] sm:text-[36px] sm:leading-[44px] sm:tracking-[-0.72px]">
          Please sign in!
        </h2>

        <div className="w-full max-w-[400px]">
          <button
            onClick={handleSignIn}
            className="h-[56px] w-full rounded-full border-2 border-[#7286ff] bg-[#141219] text-[16px] font-semibold text-white transition-colors hover:bg-[#1f1c26] sm:h-[63px] sm:text-[18px]"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
