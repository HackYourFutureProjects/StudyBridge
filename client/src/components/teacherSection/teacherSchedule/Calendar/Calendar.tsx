import React from "react";
import { ChevronLeft } from "../../../icons/ChevronLeft";
import { ChevronRight } from "../../../icons/ChevronRight";

interface TimeProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function Calendar({ onDateSelect, selectedDate }: TimeProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["M", "T", "W", "Th", "F", "S", "Su"];

  const currentDate = new Date();
  const [viewYear, setViewYear] = React.useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(currentDate.getMonth());

  const today = currentDate.getDate();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handleDateClick = (day: number): void => {
    const selectedDay = new Date(viewYear, viewMonth, day);
    const todayDate = new Date(currentYear, currentMonth, today);
    todayDate.setHours(0, 0, 0, 0);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay >= todayDate) {
      onDateSelect(selectedDay);
    }
  };

  const isPastDate = (day: number): boolean => {
    const dateToCheck = new Date(viewYear, viewMonth, day);
    const todayDate = new Date(currentYear, currentMonth, today);
    todayDate.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < todayDate;
  };

  const isSelectedDate = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const handlePreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isCurrentMonth = viewYear === currentYear && viewMonth === currentMonth;

  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDay = new Date(viewYear, viewMonth, 1).getDay() || 7;

  const calendarDays = [
    ...Array(startDay - 1).fill(null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ];

  return (
    <div className="bg-[#2C2436] rounded-xl p-4 sm:p-6 shadow-sm sm:mx-auto sm:max-w-fit">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={handlePreviousMonth}
          disabled={isCurrentMonth}
          className="text-white hover:text-[#7C86F7] disabled:text-gray-600 disabled:cursor-not-allowed transition-colors p-2"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h3 className="text-lg sm:text-xl font-semibold text-white">
          {months[viewMonth]} {viewYear}
        </h3>

        <button
          onClick={handleNextMonth}
          className="text-white hover:text-[#7C86F7] transition-colors p-2"
          aria-label="Next month"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3 sm:mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-300 w-[10vw] sm:w-[71px] max-w-[71px]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className="w-[10vw] h-[10vw] sm:w-[71px] sm:h-10 max-w-[71px] max-h-10"
          >
            {day && (
              <button
                onClick={() => handleDateClick(day)}
                disabled={isPastDate(day)}
                className={`w-full h-full rounded-[40px] flex items-center justify-center text-sm sm:text-base font-normal leading-6 transition-colors ${
                  isPastDate(day)
                    ? "text-gray-600 cursor-not-allowed opacity-50"
                    : isSelectedDate(day)
                      ? "bg-[#7C86F7] text-white"
                      : "text-white hover:bg-transparent hover:text-[#F3F2F5] sm:hover:bg-[#F3F2F5] sm:hover:text-black"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
