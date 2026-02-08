import type { ReactNode } from "react";
import { Button } from "../ui/button/Button";
import KebabVerticalIcon from "../icons/KebabVertical";
import UncheckedIcon from "../icons/Uncheked";
import Check from "../icons/Check";
import { StatusButtons } from "../ui/statusButtons/StatusButtons";
import { AppointmentStatus } from "../../types/appointments.types";

export type LessonRowData = {
  id?: string | number;
  checked: boolean;
  linkText?: string;
  lesson?: string;
  student?: string;
  price?: string;
  date?: string;
  time?: string;
  status?: AppointmentStatus;
  onStatusChange?: (status: AppointmentStatus) => void;
} & {
  [key: string]: ReactNode | string | number | boolean | undefined;
};

type LessonRowProps = {
  data: LessonRowData; // data for this row
  index: number; // row index (used for striping)
  onToggle: () => void; // checkbox toggle handler
  columns: { key: string; label: string }[]; // columns to render in order
  rowHeight: number; // row height in px
  useStatusButtons?: boolean;
};

const LessonRow = ({
  data,
  index,
  onToggle,
  columns,
  rowHeight,
  useStatusButtons = false,
}: LessonRowProps) => {
  const rowBgClass = index % 2 === 0 ? "bg-[#0F0E13]" : "bg-[#211C27]";

  return (
    <tr
      className={rowBgClass}
      style={{
        height: `${rowHeight}px`,
      }}
    >
      <td className="pl-[18px] border-b border-[#E1E1E1] bg-[#1E1927]">
        <div className="flex h-full items-center">
          <Button
            as="button"
            variant="link"
            onClick={onToggle}
            className={`flex h-[24px] w-[24px] min-h-0 min-w-0 items-center justify-center rounded-[8px] px-0 py-0 ${
              data.checked ? "bg-[#7B3FF2] text-white" : "text-[#D9D9D9]"
            }`}
          >
            {data.checked ? (
              <Check className="h-[12px] w-[12px]" />
            ) : (
              <UncheckedIcon className="h-[22px] w-[22px]" />
            )}
          </Button>
        </div>
      </td>

      {columns.map((column, columnIndex) => (
        <td
          key={`${String(data.id ?? index)}-${column.key}`}
          className={`font-inter text-[14px] text-[#B9B9B9] border-b border-[#E1E1E1] ${
            columnIndex === columns.length - 1 && column.key !== "status"
              ? "underline"
              : ""
          }`}
        >
          {column.key === "status" && useStatusButtons ? (
            <StatusButtons
              initialStatus={
                (data[column.key] as string).toLowerCase() as
                  | "pending"
                  | "approved"
                  | "rejected"
              }
              onStatusChange={data.onStatusChange}
            />
          ) : (
            (data[column.key] as ReactNode)
          )}
        </td>
      ))}

      <td className="border-b border-[#E1E1E1]">
        <div className="flex justify-center">
          <Button
            as="button"
            variant="link"
            className="h-[24px] w-[24px] min-h-0 min-w-0 px-0 py-0 text-[#EDEDED] hover:text-white"
          >
            <KebabVerticalIcon className="h-[16px] w-[16px]" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default LessonRow;
