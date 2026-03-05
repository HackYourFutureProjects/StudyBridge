type ProfileAboutMeProps = {
  aboutMe: string;
  isEditing: boolean;
  onAboutMeChange: (value: string) => void;
  onFocus: () => void;
  error?: string;
};

export const ProfileAboutMe = ({
  aboutMe,
  isEditing,
  onAboutMeChange,
  onFocus,
  error,
}: ProfileAboutMeProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
    <label className="text-white text-sm sm:text-base w-full sm:w-32 pt-2">
      About me:
    </label>
    <div className="flex-1 max-w-4xl">
      <textarea
        value={aboutMe}
        onChange={(e) => onAboutMeChange(e.target.value)}
        placeholder="About me:"
        readOnly={!isEditing}
        onFocus={onFocus}
        rows={6}
        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border rounded-lg text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none resize-none read-only:opacity-50 read-only:cursor-pointer ${
          error
            ? "border-red-500 focus:border-red-400"
            : "border-purple-500 focus:border-purple-400"
        }`}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  </div>
);
