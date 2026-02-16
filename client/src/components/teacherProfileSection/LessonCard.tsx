import type { LessonPrice } from "./types";
import { Button } from "../ui/button/Button";

type LessonCardProps = {
  lesson: LessonPrice;
  onEdit: () => void;
  onRemove: () => void;
};

export const LessonCard = ({ lesson, onEdit, onRemove }: LessonCardProps) => (
  <div className="flex items-center justify-between gap-6 px-5 py-4 bg-[#2A2433]/80 rounded-xl border border-[#7C86F7]/30 hover:border-[#7C86F7]/50 transition-colors">
    <div className="flex items-center gap-5 flex-1 min-w-0">
      <span className="text-lg font-semibold text-white truncate">
        {lesson.subject}
      </span>
      <span className="shrink-0 px-3 py-1 rounded-full text-sm font-medium bg-[#7C86F7]/20 text-[#A5B4FC] border border-[#7C86F7]/40">
        {lesson.level}
      </span>
      <span className="shrink-0 text-base font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent">
        €{lesson.price}/h
      </span>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Button type="button" variant="primary" onClick={onEdit}>
        Edit
      </Button>
      <Button type="button" variant="primary" onClick={onRemove}>
        Remove
      </Button>
    </div>
  </div>
);
