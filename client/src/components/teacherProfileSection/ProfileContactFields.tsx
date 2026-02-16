type ProfileContactFieldsProps = {
  email: string;
  phone: string;
  isEditing: boolean;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onFocusField: () => void;
};

export const ProfileContactFields = ({
  email,
  phone,
  isEditing,
  onEmailChange,
  onPhoneChange,
  onFocusField,
}: ProfileContactFieldsProps) => {
  const inputClass =
    "w-full max-w-md px-4 py-2 bg-transparent border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 read-only:opacity-50 read-only:cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-white text-base w-24">E-mail:</label>
        <div className="flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            readOnly={!isEditing}
            onFocus={onFocusField}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-white text-base w-24">Phone:</label>
        <div className="flex-1 relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            readOnly={!isEditing}
            onFocus={onFocusField}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="button"
        className="text-white underline hover:text-purple-400 transition-colors"
      >
        Change password
      </button>
    </div>
  );
};
