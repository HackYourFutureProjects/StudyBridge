import { ReactNode } from "react";
import { Button } from "../button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) => {
  if (!isOpen) return null;

  const onHandelClose = () => {
    onClose();
    onConfirm?.();
  };

  return (
    <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl z-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <div className="mb-6 text-gray-700">{children}</div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        {onConfirm && <Button onClick={onHandelClose}>{confirmText}</Button>}
      </div>
    </div>
  );
};
