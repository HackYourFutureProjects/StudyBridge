type ProfileContactFieldsProps = {
  email: string;
  phone: string;
  isEditing: boolean;
  onPhoneChange: (value: string) => void;
  onFocusField: () => void;
  onChangePassword?: () => void;
  emailError?: string;
  phoneError?: string;
};

export const ProfileContactFields = ({
  email,
  phone,
  isEditing,
  onPhoneChange,
  onFocusField,
  onChangePassword,
  emailError,
  phoneError,
}: ProfileContactFieldsProps) => {
  const getInputClass = (hasError: boolean) =>
    `w-full max-w-md px-4 py-2 bg-transparent border rounded-lg text-white focus:outline-none read-only:opacity-50 read-only:cursor-pointer ${
      hasError
        ? "border-red-500 focus:border-red-400"
        : "border-purple-500 focus:border-purple-400"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-white text-sm sm:text-base sm:w-24 shrink-0">
          E-mail:
        </label>
        <div className="flex-1 relative">
          <input
            type="email"
            value={email}
            onChange={() => {}}
            readOnly={true}
            className={getInputClass(!!emailError)}
            style={{ cursor: "not-allowed" }}
          />
          {emailError && (
            <div className="text-red-500 text-sm mt-1">{emailError}</div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label className="text-white text-sm sm:text-base sm:w-24 shrink-0">
          Phone:
        </label>
        <div className="flex-1 relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            readOnly={!isEditing}
            onFocus={onFocusField}
            className={getInputClass(!!phoneError)}
          />
          {phoneError && (
            <div className="text-red-500 text-sm mt-1">{phoneError}</div>
          )}
        </div>
      </div>

      {onChangePassword && (
        <button
          type="button"
          onClick={onChangePassword}
          className="text-white text-sm sm:text-base underline hover:text-purple-400 transition-colors cursor-pointer"
        >
          Change password
        </button>
      )}
    </div>
  );
};
