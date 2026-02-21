import { SelectComponent } from "../ui/select/select";
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS } from "./constants";

type ProfileExperienceEducationProps = {
  experience: string;
  education: string;
  isEditing: boolean;
  onExperienceChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onRowClick: () => void;
  onScheduleClick?: () => void;
};

export const ProfileExperienceEducation = ({
  experience,
  education,
  isEditing,
  onExperienceChange,
  onEducationChange,
  onRowClick,
  onScheduleClick,
}: ProfileExperienceEducationProps) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="text-white text-sm sm:text-base w-full sm:w-32 shrink-0">
        Experience:
      </label>
      <div className="flex-1 max-w-md">
        <SelectComponent
          key={`experience-${experience}`}
          options={EXPERIENCE_OPTIONS}
          value={experience}
          onChange={(value) => {
            onExperienceChange(value);
            if (!isEditing) onRowClick();
          }}
        />
      </div>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <label className="text-white text-sm sm:text-base w-full sm:w-32 shrink-0">
        Education:
      </label>
      <div className="flex-1 max-w-md">
        <SelectComponent
          key={`education-${education}`}
          options={EDUCATION_OPTIONS}
          value={education}
          onChange={(value) => {
            onEducationChange(value);
            if (!isEditing) onRowClick();
          }}
        />
      </div>
    </div>

    <button
      type="button"
      onClick={onScheduleClick}
      className="text-purple-400 underline hover:text-purple-300 transition-colors sm:ml-32 text-sm sm:text-base"
    >
      Lesson schedule
    </button>
  </>
);
