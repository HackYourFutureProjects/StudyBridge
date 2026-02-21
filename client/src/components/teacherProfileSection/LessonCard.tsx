import type { LessonPrice } from "./types";
import { Button } from "../ui/button/Button";

type LessonCardProps = {
  lesson: LessonPrice;
  onEdit: () => void;
  onRemove: () => void;
};

export const LessonCard = ({ lesson, onEdit, onRemove }: LessonCardProps) => (
  <div className="flex flex-col gap-3 px-4 sm:px-5 py-4 bg-[#2A2433]/80 rounded-xl border border-[#7C86F7]/30 hover:border-[#7C86F7]/50 transition-colors">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <span className="text-lg font-semibold text-white">{lesson.subject}</span>
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        <Button
          type="button"
          variant="primary"
          onClick={onEdit}
          className="flex-1 sm:flex-none"
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onRemove}
          className="flex-1 sm:flex-none"
        >
          Remove
        </Button>
      </div>
    </div>
    {lesson.description && (
      <p className="text-sm text-gray-300 leading-relaxed">
        {lesson.description}
      </p>
    )}
    {lesson.levels && lesson.levels.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {lesson.levels.map((levelItem, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent font-semibold text-sm border border-[#7C86F7]/40 rounded-full"
          >
            {levelItem.level}: €{levelItem.price}/h
          </span>
        ))}
      </div>
    )}
  </div>
);
