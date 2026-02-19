import React from "react";
import Cross from "../icons/Cross";

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
    <div className="bg-white rounded-2xl p-6 w-[90vw] max-w-[450px] mx-4 shadow-lg relative">
      <button
        onClick={onClose}
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#141219] hover:bg-[#1f1c26] text-white rounded-lg text-[16px] font-semibold transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
