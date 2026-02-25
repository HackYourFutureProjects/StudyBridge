import React from "react";
import { Button } from "../ui/button/Button";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl z-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <div className="mb-6 text-gray-700">{message}</div>

      <div className="flex gap-3 justify-end">
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
};
