import { SelectComponent } from "../ui/select/select";
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS } from "./constants";

type ProfileExperienceEducationProps = {
  experience: string;
  education: string;
  isEditing: boolean;
  onExperienceChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onRowClick: () => void;
};

const selectRowClass = (isEditing: boolean) =>
  `flex items-center gap-4 ${!isEditing ? "cursor-pointer" : ""}`;

export const ProfileExperienceEducation = ({
  experience,
  education,
  isEditing,
  onExperienceChange,
  onEducationChange,
  onRowClick,
}: ProfileExperienceEducationProps) => (
  <>
    <div
      className={selectRowClass(isEditing)}
      role={!isEditing ? "button" : undefined}
      tabIndex={!isEditing ? 0 : undefined}
      onClick={() => !isEditing && onRowClick()}
      onKeyDown={(e) => !isEditing && e.key === "Enter" && onRowClick()}
    >
      <label className="text-white text-base w-32 shrink-0">Experience:</label>
      <div className="flex-1 max-w-md">
        <SelectComponent
          key={`experience-${experience}`}
          options={EXPERIENCE_OPTIONS}
          defaultValue={experience}
          onChange={onExperienceChange}
          disabled={!isEditing}
        />
      </div>
    </div>

    <div
      className={selectRowClass(isEditing)}
      role={!isEditing ? "button" : undefined}
      tabIndex={!isEditing ? 0 : undefined}
      onClick={() => !isEditing && onRowClick()}
      onKeyDown={(e) => !isEditing && e.key === "Enter" && onRowClick()}
    >
      <label className="text-white text-base w-32 shrink-0">Education:</label>
      <div className="flex-1 max-w-md">
        <SelectComponent
          key={`education-${education}`}
          options={EDUCATION_OPTIONS}
          defaultValue={education}
          onChange={onEducationChange}
          disabled={!isEditing}
        />
      </div>
    </div>

    <button
      type="button"
      className="text-purple-400 underline hover:text-purple-300 transition-colors ml-32"
    >
      Lesson schedule
    </button>
  </>
);
