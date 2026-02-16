type ProfileAboutMeProps = {
  aboutMe: string;
  isEditing: boolean;
  onAboutMeChange: (value: string) => void;
  onFocus: () => void;
};

export const ProfileAboutMe = ({
  aboutMe,
  isEditing,
  onAboutMeChange,
  onFocus,
}: ProfileAboutMeProps) => (
  <div className="flex items-start gap-4">
    <label className="text-white text-base w-32 pt-2">About me:</label>
    <textarea
      value={aboutMe}
      onChange={(e) => onAboutMeChange(e.target.value)}
      placeholder="About me:"
      readOnly={!isEditing}
      onFocus={onFocus}
      rows={6}
      className="flex-1 max-w-4xl px-4 py-3 bg-transparent border border-purple-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none read-only:opacity-50 read-only:cursor-pointer"
    />
  </div>
);
