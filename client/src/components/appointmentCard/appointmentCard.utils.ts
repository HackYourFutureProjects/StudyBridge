import { AppointmentStatus } from "../../types/appointments.types";

export type StatusStyles = {
  bgCard: string;
  bgStatus: string;
  borderCard: string;
  text: string;
  label: string;
};

export const getStatusStyles = (status: AppointmentStatus): StatusStyles => {
  switch (status) {
    case "pending":
      return {
        bgCard: "bg-[#15141D80]",
        bgStatus: "bg-[#FEF9C233]",
        borderCard: "border-[#FEF9C2]",
        text: "text-[#FEF9C2]",
        label: "Pending",
      };
    case "approved":
      return {
        bgCard: "bg-[#15141D80]",
        bgStatus: "bg-[#4ade8033]",
        borderCard: "border-green-500",
        text: "text-[#4ade80]",
        label: "Approved",
      };
    case "rejected":
      return {
        bgCard: "bg-[#15141D80]",
        bgStatus: "bg-[#ef444433]",
        borderCard: "border-red-500",
        text: "text-[#ef4444]",
        label: "Rejected",
      };
  }
};

export const isInternalVideoCallLink = (videoCall?: string): boolean => {
  return typeof videoCall === "string" && videoCall.startsWith("/call/");
};
