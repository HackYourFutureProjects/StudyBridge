import { Button } from "../ui/button/Button";
import { SelectComponent } from "../ui/select/Select";
import { LEVELS, SUBJECTS } from "./constants";
import { useState } from "react";
import { useModalStore } from "../../store/modals.store";

type LessonFormProps = {
  subject: string;
  description: string;
  levels: Array<{ level: string; price: string }>;
  isEditingLesson: boolean;
  onSubjectChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onLevelsChange: (levels: Array<{ level: string; price: string }>) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export const LessonForm = ({
  subject,
  description,
  levels,
  isEditingLesson,
  onSubjectChange,
  onDescriptionChange,
  onLevelsChange,
  onSubmit,
  onCancel,
}: LessonFormProps) => {
  const [newLevel, setNewLevel] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const openModal = useModalStore((s) => s.open);

  const handleAddLevel = () => {
    if (!newLevel) {
      openModal("alert", {
        title: "Missing Level",
        message: "Please select a level",
      });
      return;
    }
    if (!newPrice) {
      openModal("alert", {
        title: "Missing Price",
        message: "Please enter a price",
      });
      return;
    }

    const isDuplicate = levels.some((l) => l.level === newLevel);
    if (isDuplicate) {
      openModal("alert", {
        title: "Duplicate Level",
        message: "This level already exists for this subject",
      });
      return;
    }

    onLevelsChange([...levels, { level: newLevel, price: newPrice }]);
    setNewLevel("");
    setNewPrice("");
  };

  const handleRemoveLevel = (index: number) => {
    onLevelsChange(levels.filter((_, i) => i !== index));
  };

  return (
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
          value={subject}
          onChange={onSubjectChange}
          placeholder="Select subject"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">Description:</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe what you teach in this subject..."
          rows={4}
          className="w-full px-4 py-3 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none"
        />
      </div>

      <div>
        <label className="text-white text-sm mb-2 block">
          Levels and Prices:
        </label>

        {levels.length > 0 && (
          <div className="space-y-2 mb-4">
            {levels.map((levelItem, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#15141D] rounded-lg"
              >
                <span className="text-white flex-1">
                  {levelItem.level} - €{levelItem.price}/h
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLevel(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 mt-3">
          <div className="flex-1">
            <SelectComponent
              key={`level-${newLevel}`}
              options={LEVELS}
              value={newLevel}
              onChange={setNewLevel}
              placeholder="Select level"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Price (€)"
              min={1}
              className="w-full sm:flex-1 px-3 py-2 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
            />
            <Button
              type="button"
              onClick={handleAddLevel}
              variant="secondary"
              className="w-full sm:w-auto shrink-0"
            >
              + Add Level
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <Button
          type="button"
          onClick={onSubmit}
          variant="primary"
          className="flex-1 w-full"
        >
          {isEditingLesson ? "Save Changes" : "Save"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="flex-1 w-full"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
