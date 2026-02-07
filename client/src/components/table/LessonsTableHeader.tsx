type LessonsTableHeaderProps = {
  columns: { key: string; label: string }[]; // header labels in order
  headerHeight: number; // header row height in px
};

const LessonsTableHeader = ({
  columns,
  headerHeight,
}: LessonsTableHeaderProps) => {
  return (
    <thead className="bg-[#211D2A]">
      <tr
        className="border-b border-[#E1E1E1]"
        style={{ height: `${headerHeight}px` }}
      >
        <th className="pl-[18px] text-left">
          <div className="h-[24px] w-[24px] rounded-[8px] border border-[#E1E1E1]" />
        </th>

        {columns.map((column) => (
          <th
            key={column.key}
            className="font-inter text-[14px] font-semibold text-[#F2F2F2] text-left"
          >
            {column.label}
          </th>
        ))}

        <th />
      </tr>
    </thead>
  );
};

export default LessonsTableHeader;
