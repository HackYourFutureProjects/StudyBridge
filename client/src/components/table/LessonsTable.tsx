import LessonsTableHeader from "./LessonsTableHeader";
import LessonRow, { type LessonRowData } from "./LessonRow";
import { useState } from "react";
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
const DEFAULT_ACTION_COL = "80px";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleRow = (rowId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }

      if (onSelectionChange) {
        onSelectionChange(Array.from(newSet));
      }

      return newSet;
    });
  };

  const handleSelectAll = () => {
    const pastRows = sourceRows.filter((row) => {
      if (!isPastAppointment || !row.date || !row.time || !row.id) return false;
      return isPastAppointment(String(row.date), String(row.time));
    });

    const pastIds = new Set(pastRows.map((row) => String(row.id)));
    const allPastSelected = pastRows.every((row) =>
      selectedIds.has(String(row.id)),
    );

    setSelectedIds((prev) => {
      const newSet = new Set(prev);

      if (allPastSelected) {
        pastIds.forEach((id) => newSet.delete(id));
      } else {
        pastIds.forEach((id) => newSet.add(id));
      }

      if (onSelectionChange) {
        onSelectionChange(Array.from(newSet));
      }

      return newSet;
    });
  };

  const hasSelection = selectedIds.size > 0;

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
          {sourceRows.map((row, index) => {
            const canSelect =
              !isPastAppointment ||
              !row.date ||
              !row.time ||
              isPastAppointment(String(row.date), String(row.time));

            const rowWithChecked: LessonRowData = {
              ...row,
              checked: row.id ? selectedIds.has(String(row.id)) : false,
            };

            return (
              <LessonRow
                key={row.id ?? index}
                data={rowWithChecked}
                index={index}
                onToggle={() => row.id && handleToggleRow(String(row.id))}
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
