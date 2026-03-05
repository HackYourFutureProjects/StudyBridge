import { useState } from "react";
import { ProfileAvatar } from "../../../components/teacherProfileSection/ProfileAvatar";
import { ProfileHeader } from "../../../components/teacherProfileSection/ProfileHeader";
import { ProfileContactFields } from "../../../components/teacherProfileSection/ProfileContactFields";
import { ChangePasswordModal } from "../../../components/changePasswordModal/ChangePasswordModal";
import { useMyStudentProfileQuery } from "../../../features/students/query/useMyStudentProfileQuery";
import { useUpdateMyStudentProfileMutation } from "../../../features/students/mutations/useUpdateMyStudentProfileMutation";
import { updatePasswordApi } from "../../../api/auth/auth.api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { studentProfileSchema } from "../../../components/studentProfileSection/studentProfile.validation";

export const StudentProfile = () => {
  const { data: profile, isLoading, error } = useMyStudentProfileQuery();
  const updateProfileMutation = useUpdateMyStudentProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});

  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  const clearFieldError = (fieldName: string) => {
    if (validationErrors[fieldName as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    clearFieldError("name");
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    clearFieldError("phone");
  };

  const displayName =
    name !== null
      ? name
      : profile
        ? `${profile.firstName} ${profile.lastName}`
        : "";
  const displayEmail = email !== null ? email : profile?.email || "";
  const displayPhone = phone !== null ? phone : profile?.phoneNumber || "+";

  const handleSaveProfile = async () => {
    setValidationErrors({});

    const formData = {
      name: displayName.trim(),
      phone: displayPhone.trim(),
    };

    const validation = studentProfileSchema.safeParse(formData);

    if (!validation.success) {
      const errors: { [key: string]: string } = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
        email: displayEmail || undefined,
        phoneNumber: displayPhone !== "+" ? displayPhone : undefined,
      });

      setName(null);
      setEmail(null);
      setPhone(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      await updatePasswordApi({
        oldPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      success("Password changed successfully");
    } catch (error) {
      notifyError(getErrorMessage(error));
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#15141D]">
        <div className="px-4 sm:px-6 lg:px-10 flex flex-col">
          <div className="pt-6 sm:pt-8 lg:pt-10 flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12">
              My profile
            </h1>
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 flex flex-col">
        <div className="pt-6 sm:pt-8 lg:pt-10 flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12">
            My profile
          </h1>
          <div className="text-white">
            Error loading profile. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 flex flex-col">
      <div className="pt-6 sm:pt-8 lg:pt-10 flex-1">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12">
          My profile
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <ProfileAvatar avatarUrl={profile?.profileImageUrl || undefined} />
          <div className="flex-1 space-y-4 sm:space-y-6">
            <ProfileHeader
              name={displayName}
              isEditing={isEditing}
              onNameChange={handleNameChange}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              error={validationErrors.name}
            />
            <ProfileContactFields
              email={displayEmail}
              phone={displayPhone}
              isEditing={isEditing}
              onPhoneChange={handlePhoneChange}
              onFocusField={() => setIsEditing(true)}
              onChangePassword={() => setIsPasswordModalOpen(true)}
              phoneError={validationErrors.phone}
            />
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handleChangePassword}
        />
      </div>
    </div>
  );
};
