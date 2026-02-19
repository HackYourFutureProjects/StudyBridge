import LessonsTableHeader from "./LessonsTableHeader";
import LessonRow, { type LessonRowData } from "./LessonRow";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export type LessonsTableColumn = {
  key: string;
  label: string;
  width?: string;
};

type LessonsTableProps = {
  rows: LessonRowData[];
  columns: LessonsTableColumn[];
  width?: number | string;
  height?: number | string;
  headerHeight?: number;
  rowHeight?: number;
  className?: string;
  useStatusButtons?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onBulkDelete?: () => void;
  isPastAppointment?: (date: string, time: string) => boolean;
};

const DEFAULT_CHECKBOX_COL = "62px";
const DEFAULT_ACTION_COL = "50px";

const TABLE_CLASS =
  "overflow-hidden rounded-[12px] border border-[#E1E1E133] bg-[#16131D] shadow-[0_12px_40px_rgba(0,0,0,0.35)]";

const LessonsTable = ({
  rows: sourceRows,
  columns,
  width = "100%",
  height,
  headerHeight = 58,
  rowHeight = 58,
  className,
  useStatusButtons = false,
  onSelectionChange,
  onBulkDelete,
  isPastAppointment,
}: LessonsTableProps) => {
  const [rows, setRows] = useState<LessonRowData[]>(sourceRows);

  useEffect(() => {
    setRows(sourceRows);
  }, [sourceRows]);

  const handleToggleRow = (rowIndex: number) => {
    setRows((prev) => {
      const newRows = prev.map((row, index) =>
        index === rowIndex ? { ...row, checked: !row.checked } : row,
      ) as LessonRowData[];

      if (onSelectionChange) {
        const selectedIds = newRows
          .filter((row) => row.checked && row.id)
          .map((row) => String(row.id));
        onSelectionChange(selectedIds);
      }

      return newRows;
    });
  };

  const handleSelectAll = () => {
    setRows((prev) => {
      const pastRows = prev.filter((row) => {
        if (!isPastAppointment || !row.date || !row.time) return true;
        return isPastAppointment(String(row.date), String(row.time));
      });

      const allPastChecked = pastRows.every((row) => row.checked);

      const newRows = prev.map((row) => {
        const isPast =
          !isPastAppointment ||
          !row.date ||
          !row.time ||
          isPastAppointment(String(row.date), String(row.time));

        if (isPast) {
          return { ...row, checked: !allPastChecked };
        }
        return row;
      }) as LessonRowData[];

      if (onSelectionChange) {
        const selectedIds = newRows
          .filter((row) => row.checked && row.id)
          .map((row) => String(row.id));
        onSelectionChange(selectedIds);
      }

      return newRows;
    });
  };

  const hasSelection = rows.some((row) => row.checked);

  const columnWidths = [
    DEFAULT_CHECKBOX_COL,
    ...columns.map((column) => column.width ?? "auto"),
    DEFAULT_ACTION_COL,
  ];

  const tableHeightValue = typeof height === "number" ? `${height}px` : height;
  const tableWidthValue = typeof width === "number" ? `${width}px` : width;
  const hasFixedHeight = height !== undefined;

  return (
    <div
      className={twMerge(
        TABLE_CLASS,
        "w-full min-w-0 overflow-x-auto",
        className,
      )}
      style={{
        width: tableWidthValue,
        ...(hasFixedHeight ? { height: tableHeightValue } : {}),
      }}
    >
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {columnWidths.map((widthValue, index) => (
            <col key={`col-${index}`} style={{ width: widthValue }} />
          ))}
        </colgroup>

        <LessonsTableHeader
          columns={columns}
          headerHeight={headerHeight}
          onSelectAll={handleSelectAll}
          hasSelection={hasSelection}
          onBulkDelete={onBulkDelete}
        />
        <tbody
          style={
            hasFixedHeight ? { height: `calc(100% - ${headerHeight}px)` } : {}
          }
        >
          {rows.map((row, index) => {
            const canSelect =
              !isPastAppointment ||
              !row.date ||
              !row.time ||
              isPastAppointment(String(row.date), String(row.time));

            return (
              <LessonRow
                key={row.id ?? index}
                data={row}
                index={index}
                onToggle={() => handleToggleRow(index)}
                columns={columns}
                rowHeight={rowHeight}
                useStatusButtons={useStatusButtons}
                canSelect={canSelect}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LessonsTable;
