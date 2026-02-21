import type { LessonPrice } from "./types";
import { Button } from "../ui/button/Button";
import { LessonForm } from "./LessonForm";
import { LessonCard } from "./LessonCard";

type LessonsSectionProps = {
  lessons: LessonPrice[];
  showAddForm: boolean;
  editingLessonIndex: number | null;
  newSubject: string;
  newDescription: string;
  newLevels: Array<{ level: string; price: string }>;
  onShowAddForm: (show: boolean) => void;
  onNewSubjectChange: (value: string) => void;
  onNewDescriptionChange: (value: string) => void;
  onNewLevelsChange: (levels: Array<{ level: string; price: string }>) => void;
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
  newDescription,
  newLevels,
  onShowAddForm,
  onNewSubjectChange,
  onNewDescriptionChange,
  onNewLevelsChange,
  onAddLesson,
  onUpdateLesson,
  onEditLesson,
  onRemoveLesson,
  onCancelForm,
}: LessonsSectionProps) => {
  const handleSubmit = () =>
    editingLessonIndex !== null ? onUpdateLesson() : onAddLesson();

  const canAddMore = lessons.length < 5;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
        <label className="text-white text-sm sm:text-base">
          Lessons and Price: {lessons.length > 0 && `(${lessons.length}/5)`}
        </label>
        {!showAddForm && canAddMore && (
          <Button
            type="button"
            onClick={() => onShowAddForm(true)}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            + Add Lesson
          </Button>
        )}
        {!showAddForm && !canAddMore && (
          <span className="text-xs sm:text-sm text-gray-400 italic">
            Maximum 5 subjects reached
          </span>
        )}
      </div>

      {showAddForm && (
        <LessonForm
          subject={newSubject}
          description={newDescription}
          levels={newLevels}
          isEditingLesson={editingLessonIndex !== null}
          onSubjectChange={onNewSubjectChange}
          onDescriptionChange={onNewDescriptionChange}
          onLevelsChange={onNewLevelsChange}
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
