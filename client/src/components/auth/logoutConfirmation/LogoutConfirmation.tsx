import React from "react";
import { Modal } from "../../ui/modal/Modal";
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      onConfirm={() => logout()}
      confirmText={isPending ? "Logging out..." : "Log out"}
      cancelText="Cancel"
    >
      <p>Are you sure you want to log out?</p>
    </Modal>
  );
};
