import { useState } from "react";

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

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const getButtonStyle = (buttonStatus: Status) => {
    const baseStyle =
      "px-3 py-1 rounded-md text-sm font-medium transition-colors";

    if (status === buttonStatus) {
      switch (buttonStatus) {
        case "pending":
          return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300`;
        case "approved":
          return `${baseStyle} bg-green-100 text-green-800 border border-green-300`;
        case "rejected":
          return `${baseStyle} bg-red-100 text-red-800 border border-red-300`;
      }
    }

    return `${baseStyle} bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100`;
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusChange("pending")}
        className={getButtonStyle("pending")}
      >
        Pending
      </button>
      <button
        onClick={() => handleStatusChange("approved")}
        className={getButtonStyle("approved")}
      >
        Approve
      </button>
      <button
        onClick={() => handleStatusChange("rejected")}
        className={getButtonStyle("rejected")}
      >
        Reject
      </button>
    </div>
  );
};
