import { useState, useEffect, type MouseEvent } from "react";

type Status = "pending" | "approved" | "rejected";

interface StatusButtonsProps {
  initialStatus?: Status;
  onStatusChange?: (status: Status) => void;
}

export const StatusButtons = ({
  initialStatus = "pending",
  onStatusChange,
}: StatusButtonsProps) => {
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  const handleStatusChange = (
    newStatus: Status,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const getButtonStyle = (buttonStatus: Status) => {
    const baseStyle =
      "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer";

    if (status === buttonStatus) {
      switch (buttonStatus) {
        case "pending":
          return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200`;
        case "approved":
          return `${baseStyle} bg-green-100 text-green-800 border border-green-300 hover:bg-green-200`;
        case "rejected":
          return `${baseStyle} bg-red-100 text-red-800 border border-red-300 hover:bg-red-200`;
      }
    }

    return `${baseStyle} bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100`;
  };

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => handleStatusChange("pending", e)}
        className={getButtonStyle("pending")}
      >
        Pending
      </button>
      <button
        type="button"
        onClick={(e) => handleStatusChange("approved", e)}
        className={getButtonStyle("approved")}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={(e) => handleStatusChange("rejected", e)}
        className={getButtonStyle("rejected")}
      >
        Reject
      </button>
    </div>
  );
};
