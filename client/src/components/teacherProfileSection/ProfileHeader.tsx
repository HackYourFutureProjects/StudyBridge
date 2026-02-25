import { Button } from "../ui/button/Button";
import { useEffect, useRef } from "react";

type ProfileHeaderProps = {
  name: string;
  isEditing: boolean;
  onNameChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
};

export const ProfileHeader = ({
  name,
  isEditing,
  onNameChange,
  onEdit,
  onSave,
}: ProfileHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const inputClass =
    "w-full max-w-md px-4 py-2 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 read-only:opacity-50 read-only:cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={isEditing ? onSave : onEdit}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-white text-sm sm:text-base sm:w-24 shrink-0">
          Name:
        </label>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            readOnly={!isEditing}
            onFocus={onEdit}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};
