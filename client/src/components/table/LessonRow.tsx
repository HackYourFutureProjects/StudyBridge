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
  teacher?: string;
  price?: string;
  date?: string;
  time?: string;
  status?: AppointmentStatus;
  videoCall?: ReactNode;
  onStatusChange?: (status: AppointmentStatus) => void;
  onDelete?: () => void;
  canDelete?: boolean;
  isPast?: boolean;
  [key: string]:
    | ReactNode
    | string
    | number
    | boolean
    | ((status: AppointmentStatus) => void)
    | (() => void)
    | undefined;
};

type LessonRowProps = {
  data: LessonRowData;
  index: number;
  onToggle: () => void;
  columns: { key: string; label: string }[];
  rowHeight: number;
  useStatusButtons?: boolean;
  canSelect?: boolean;
};

const LessonRow = ({
  data,
  index,
  onToggle,
  columns,
  rowHeight,
  useStatusButtons = false,
  canSelect = true,
}: LessonRowProps) => {
  const rowBgClass = index % 2 === 0 ? "bg-[#0F0E13]" : "bg-[#211C27]";
  const isPastLesson = data.isPast ?? false;

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
            onClick={canSelect ? onToggle : undefined}
            disabled={!canSelect}
            className={`flex h-[24px] w-[24px] min-h-0 min-w-0 items-center justify-center rounded-[8px] px-0 py-0 ${
              data.checked ? "bg-[#7B3FF2] text-white" : "text-white"
            } ${!canSelect ? "opacity-30 cursor-not-allowed" : ""}`}
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
          className={`font-inter p-2 text-[14px] border-b border-[#E1E1E1] ${
            columnIndex === columns.length - 1 && column.key !== "status"
              ? "underline"
              : ""
          }`}
          onClick={(e) => {
            if (column.key === "status") {
              e.stopPropagation();
            }
          }}
        >
          <div className={isPastLesson ? "opacity-50" : ""}>
            {column.key === "status" && useStatusButtons ? (
              <StatusButtons
                initialStatus={
                  (data[column.key] as string).toLowerCase() as
                    | "pending"
                    | "approved"
                    | "rejected"
                }
                onStatusChange={data.onStatusChange}
                disabled={isPastLesson}
              />
            ) : column.key === "videoCall" &&
              typeof data[column.key] === "string" &&
              data[column.key] &&
              data[column.key] !== "N/A" ? (
              <a
                href={data[column.key] as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${isPastLesson ? "text-gray-500" : "text-[#B9B9B9]"} hover:text-[#7186FF]`}
              >
                {(data.linkText as string) || "Join"}
              </a>
            ) : column.key === "videoCall" ? (
              <span
                className={isPastLesson ? "text-gray-500" : "text-[#B9B9B9]"}
              >
                {data[column.key] as ReactNode}
              </span>
            ) : column.key === "date" ? (
              <span
                className={isPastLesson ? "text-red-500" : "text-green-700"}
              >
                {data[column.key] as ReactNode}
              </span>
            ) : (
              <span
                className={isPastLesson ? "text-gray-500" : "text-[#B9B9B9]"}
              >
                {data[column.key] as ReactNode}
              </span>
            )}
          </div>
        </td>
      ))}

      <td className="border-b border-[#E1E1E1] pl-6">
        <div className="flex justify-center">
          {data.canDelete && data.onDelete ? (
            <Button
              as="button"
              variant="link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                data.onDelete?.();
              }}
              className="h-[24px] w-[24px] min-h-0 min-w-0 px-0 py-0 text-white hover:text-red-500"
              title="Delete past appointment"
            >
              <KebabVerticalIcon className="h-[16px] w-[16px]" />
            </Button>
          ) : (
            <Button
              as="button"
              variant="link"
              className="h-[24px] w-[24px] min-h-0 min-w-0 px-0 py-0 text-[#EDEDED] opacity-30 cursor-not-allowed"
              disabled
            >
              <KebabVerticalIcon className="h-[16px] w-[16px]" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LessonRow;
