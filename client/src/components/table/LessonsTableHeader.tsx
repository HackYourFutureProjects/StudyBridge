import KebabVerticalIcon from "../icons/KebabVertical";
import { Button } from "../ui/button/Button";

type LessonsTableHeaderProps = {
  columns: { key: string; label: string }[];
  headerHeight: number;
  onSelectAll?: () => void;
  hasSelection?: boolean;
  onBulkDelete?: () => void;
};

const LessonsTableHeader = ({
  columns,
  headerHeight,
  onSelectAll,
  hasSelection = false,
  onBulkDelete,
}: LessonsTableHeaderProps) => {
  return (
    <thead className="bg-[#211D2A]">
      <tr
        className="border-b border-[#E1E1E1]"
        style={{ height: `${headerHeight}px` }}
      >
        <th className="pl-[18px] text-left">
          <button
            type="button"
            onClick={onSelectAll}
            aria-label="Select all past appointments"
            className="h-[24px] w-[24px] rounded-[8px] border border-[#E1E1E1] hover:bg-[#7B3FF2] transition-colors cursor-pointer"
          />
        </th>

        {columns.map((column) => (
          <th
            key={column.key}
            className="font-inter p-2 text-[14px] font-semibold text-[#F2F2F2] text-left"
          >
            {column.label}
          </th>
        ))}

        <th>
          {hasSelection && onBulkDelete && (
            <div className="flex justify-center">
              <Button
                as="button"
                variant="link"
                onClick={onBulkDelete}
                className="h-[24px] w-[24px] min-h-0 min-w-0 px-0 py-0 text-[#EDEDED] hover:text-red-500"
                title="Delete selected appointments"
              >
                <KebabVerticalIcon className="h-[16px] w-[16px]" />
              </Button>
            </div>
          )}
        </th>
      </tr>
    </thead>
  );
};

export default LessonsTableHeader;
