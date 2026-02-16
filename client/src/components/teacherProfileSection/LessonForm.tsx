import { Button } from "../ui/button/Button";
import { SelectComponent } from "../ui/select/select";
import { SUBJECTS, LEVELS } from "./constants";

type LessonFormProps = {
  subject: string;
  level: string;
  price: string;
  isEditingLesson: boolean;
  onSubjectChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const LessonForm = ({
  subject,
  level,
  price,
  isEditingLesson,
  onSubjectChange,
  onLevelChange,
  onPriceChange,
  onSubmit,
  onCancel,
}: LessonFormProps) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="mb-6 p-6 bg-[#2A2433] rounded-lg border border-purple-500 space-y-4"
  >
    <h3 className="text-xl font-semibold text-white mb-4">
      {isEditingLesson ? "Edit Lesson" : "Add New Lesson"}
    </h3>

    <div>
      <label className="text-white text-sm mb-2 block">Subject:</label>
      <SelectComponent
        key={`subject-${subject}`}
        options={SUBJECTS}
        defaultValue={subject}
        onChange={onSubjectChange}
      />
    </div>

    <div>
      <label className="text-white text-sm mb-2 block">Level:</label>
      <SelectComponent
        key={`level-${level}`}
        options={LEVELS}
        defaultValue={level}
        onChange={onLevelChange}
      />
    </div>

    <div>
      <label className="text-white text-sm mb-2 block">Price (€/hour):</label>
      <input
        type="number"
        value={price}
        onChange={(e) => onPriceChange(e.target.value)}
        placeholder="Enter price per hour (e.g., 30)"
        min={1}
        className="w-full px-4 py-3 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
      />
    </div>

    <div className="flex gap-4 pt-2">
      <Button
        type="button"
        onClick={onSubmit}
        variant="primary"
        className="flex-1"
      >
        {isEditingLesson ? "Update" : "ADD"}
      </Button>
      <Button
        type="button"
        onClick={onCancel}
        variant="secondary"
        className="flex-1"
      >
        Cancel
      </Button>
    </div>
  </form>
);
