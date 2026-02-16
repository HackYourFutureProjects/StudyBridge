import { Button } from "../ui/button/Button";

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
}: ProfileHeaderProps) => (
  <div className="flex items-center gap-4">
    {isEditing ? (
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="text-4xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent bg-transparent border-b border-purple-500 focus:outline-none"
      />
    ) : (
      <h2
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={(e) => e.key === "Enter" && onEdit()}
        className="text-4xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent cursor-pointer hover:opacity-90"
      >
        {name}
      </h2>
    )}
    <Button onClick={isEditing ? onSave : onEdit} variant="secondary">
      {isEditing ? "Save" : "Edit"}
    </Button>
  </div>
);
