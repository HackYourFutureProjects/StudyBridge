import React from "react";
import Cross from "../icons/Cross";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) => {
  const confirmBtnClass =
    confirmVariant === "primary"
      ? "px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[16px] font-semibold transition-colors"
      : "px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-[16px] font-semibold transition-colors";

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-2xl p-6 w-[90vw] max-w-[500px] mx-4 shadow-lg relative">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Close"
      >
        <Cross className="w-5 h-5 text-[#344054]" />
      </button>

      <div className="flex flex-col gap-6 pt-2">
        <h2 className="text-[24px] font-semibold text-[#101828] leading-[32px]">
          {title}
        </h2>

        <p className="text-[16px] text-[#475467] leading-[24px]">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white text-[#344054] rounded-lg text-[16px] font-semibold border border-[#D0D5DD] hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={confirmBtnClass}
            // className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-[16px] font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
