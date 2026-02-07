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
  width?: number | string; // table width ( px)
  height?: number | string; // table height ( px)
  headerHeight?: number; // header row height in px
  rowHeight?: number; // body row height in px
  className?: string; // extra classes for the table container
};

const DEFAULT_CHECKBOX_COL = "62px";
const DEFAULT_ACTION_COL = "50px";

const TABLE_CLASS =
  "overflow-hidden rounded-[12px] border border-[#E1E1E133] bg-[#16131D] shadow-[0_12px_40px_rgba(0,0,0,0.35)]";

const LessonsTable = ({
  rows: sourceRows,
  columns,
  width = 718,
  height,
  headerHeight = 58,
  rowHeight = 58,
  className,
}: LessonsTableProps) => {
  const [rows, setRows] = useState<LessonRowData[]>(sourceRows);

  const handleToggleRow = (rowIndex: number) => {
    setRows((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, checked: !row.checked } : row,
      ),
    );
  };

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
      className={twMerge(TABLE_CLASS, className)}
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

        <LessonsTableHeader columns={columns} headerHeight={headerHeight} />

        <tbody
          style={
            hasFixedHeight ? { height: `calc(100% - ${headerHeight}px)` } : {}
          }
        >
          {rows.map((row, index) => (
            <LessonRow
              key={row.id ?? index}
              data={row}
              index={index}
              onToggle={() => handleToggleRow(index)}
              columns={columns}
              rowHeight={rowHeight}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonsTable;
