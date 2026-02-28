import { useState, useEffect, type MouseEvent } from "react";

type Status = "pending" | "approved" | "rejected";

interface StatusButtonsProps {
  initialStatus?: Status;
  onStatusChange?: (status: Status) => void;
  disabled?: boolean;
}

export const StatusButtons = ({
  initialStatus = "pending",
  onStatusChange,
  disabled = false,
}: StatusButtonsProps) => {
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = (
    newStatus: Status,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const getButtonStyle = (buttonStatus: Status) => {
    const baseStyle =
      "px-4 py-2 rounded-full text-sm font-medium transition-colors";
    const cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";

    if (status === buttonStatus) {
      switch (buttonStatus) {
        case "pending":
          return `${baseStyle} ${cursorStyle} bg-yellow-100 text-yellow-800 border border-yellow-300 ${!disabled ? "hover:bg-yellow-200" : "opacity-50"}`;
        case "approved":
          return `${baseStyle} ${cursorStyle} bg-green-100 text-green-800 border border-green-300 ${!disabled ? "hover:bg-green-200" : "opacity-50"}`;
        case "rejected":
          return `${baseStyle} ${cursorStyle} bg-red-100 text-red-800 border border-red-300 ${!disabled ? "hover:bg-red-200" : "opacity-50"}`;
      }
    }

    return `${baseStyle} ${cursorStyle} bg-gray-50 text-gray-600 border border-gray-300 ${!disabled ? "hover:bg-gray-100" : "opacity-50"}`;
  };

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => handleStatusChange("pending", e)}
        className={getButtonStyle("pending")}
        disabled={disabled}
      >
        Pending
      </button>
      <button
        type="button"
        onClick={(e) => handleStatusChange("approved", e)}
        className={getButtonStyle("approved")}
        disabled={disabled}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={(e) => handleStatusChange("rejected", e)}
        className={getButtonStyle("rejected")}
        disabled={disabled}
      >
        Reject
      </button>
    </div>
  );
};
