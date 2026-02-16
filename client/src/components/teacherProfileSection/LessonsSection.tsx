import type { LessonPrice } from "./types";
import { Button } from "../ui/button/Button";
import { LessonForm } from "./LessonForm";
import { LessonCard } from "./LessonCard";

type LessonsSectionProps = {
  lessons: LessonPrice[];
  showAddForm: boolean;
  editingLessonIndex: number | null;
  newSubject: string;
  newLevel: string;
  newPrice: string;
  onShowAddForm: (show: boolean) => void;
  onNewSubjectChange: (value: string) => void;
  onNewLevelChange: (value: string) => void;
  onNewPriceChange: (value: string) => void;
  onAddLesson: () => void;
  onUpdateLesson: () => void;
  onEditLesson: (index: number) => void;
  onRemoveLesson: (index: number) => void;
  onCancelForm: () => void;
};

export const LessonsSection = ({
  lessons,
  showAddForm,
  editingLessonIndex,
  newSubject,
  newLevel,
  newPrice,
  onShowAddForm,
  onNewSubjectChange,
  onNewLevelChange,
  onNewPriceChange,
  onAddLesson,
  onUpdateLesson,
  onEditLesson,
  onRemoveLesson,
  onCancelForm,
}: LessonsSectionProps) => {
  const handleSubmit = () =>
    editingLessonIndex !== null ? onUpdateLesson() : onAddLesson();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-white text-base">Lessons and Price:</label>
        {!showAddForm && (
          <Button
            type="button"
            onClick={() => onShowAddForm(true)}
            variant="secondary"
          >
            + Add Lesson
          </Button>
        )}
      </div>

      {showAddForm && (
        <LessonForm
          subject={newSubject}
          level={newLevel}
          price={newPrice}
          isEditingLesson={editingLessonIndex !== null}
          onSubjectChange={onNewSubjectChange}
          onLevelChange={onNewLevelChange}
          onPriceChange={onNewPriceChange}
          onSubmit={handleSubmit}
          onCancel={onCancelForm}
        />
      )}

      {lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={index}
              lesson={lesson}
              onEdit={() => onEditLesson(index)}
              onRemove={() => onRemoveLesson(index)}
            />
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-gray-500 italic">
            No lessons added yet. Click &apos;Add Lesson&apos; to add your first
            lesson.
          </div>
        )
      )}
    </div>
  );
};
