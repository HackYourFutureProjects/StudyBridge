import { useMemo, useState } from "react";
import { Button } from "../ui/button/Button";
import LeftArrowIcon from "../icons/LeftArrow";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthLabel = (date: Date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildMonthCells = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - startOffset + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(year, month, day);
  });
};

export const Calendar = () => {
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const days = useMemo(() => buildMonthCells(monthDate), [monthDate]);
  const label = monthLabel(monthDate);

  const goPrev = () =>
    setMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  const goNext = () =>
    setMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );

  return (
    <div className="w-[306px] h-[319px] rounded-[24px] bg-[#1E1927] px-[24px] py-[20px] shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]">
      <div className="flex items-center justify-between">
        <Button
          as="button"
          onClick={goPrev}
          variant="link"
          className="h-7 w-7 min-h-0 min-w-0 rounded-full px-0 py-0 text-[#B9B9B9] hover:text-white transition-colors"
        >
          <LeftArrowIcon className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="text-[12px] font-semibold text-[#EDEDED]">{label}</div>

        <Button
          as="button"
          onClick={goNext}
          variant="link"
          className="h-7 w-7 min-h-0 min-w-0 rounded-full px-0 py-0 text-[#B9B9B9] hover:text-white transition-colors"
        >
          <LeftArrowIcon className="h-4 w-4 rotate-180" aria-hidden="true" />
        </Button>
      </div>

      <div className="mt-[12px] grid grid-cols-7 gap-y-[6px] text-[10px] text-[#9A9A9A]">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="mt-[8px] grid grid-cols-7 gap-y-[6px] text-[12px] text-[#EDEDED]">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isToday = isSameDay(date, today);
          const isSelected =
            selectedDate !== null && isSameDay(date, selectedDate);

          return (
            <Button
              key={date.toISOString()}
              as="button"
              type="button"
              onClick={() => setSelectedDate(date)}
              variant="link"
              className={[
                "mx-auto flex h-7 w-7 min-h-0 min-w-0 items-center justify-center rounded-full px-0 py-0 transition-colors",
                isSelected ? "bg-[#FF6B4A] text-white" : "",
                !isSelected && isToday ? "bg-[#2A2433] text-white" : "",
                !isSelected && !isToday ? "hover:bg-[#2A2433]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {date.getDate()}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
