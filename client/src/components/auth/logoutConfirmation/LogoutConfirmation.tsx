import React from "react";
import { Button } from "../../ui/button/Button";
import { useLogoutMutation } from "../../../features/auth/mutations/useLogoutMutation";

/**
 * This component is a confirmation modal that appears when the user clicks the "Logout" button in the TopBar.
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmation: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: logout, isPending } = useLogoutMutation();

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Confirm Logout
      </h2>

      <div className="mb-6 text-gray-700">
        <p>Are you sure you want to log out?</p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => logout()} disabled={isPending}>
          {isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </div>
  );
};
