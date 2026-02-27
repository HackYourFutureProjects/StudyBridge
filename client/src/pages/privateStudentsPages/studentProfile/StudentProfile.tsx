import { useState } from "react";
import { ProfileAvatar } from "../../../components/teacherProfileSection/ProfileAvatar";
import { ProfileHeader } from "../../../components/teacherProfileSection/ProfileHeader";
import { ProfileContactFields } from "../../../components/teacherProfileSection/ProfileContactFields";
import { ChangePasswordModal } from "../../../components/changePasswordModal/ChangePasswordModal";
import { useMyStudentProfileQuery } from "../../../features/students/query/useMyStudentProfileQuery";
import { useUpdateMyStudentProfileMutation } from "../../../features/students/mutations/useUpdateMyStudentProfileMutation";

export const StudentProfile = () => {
  const { data: profile, isLoading, error } = useMyStudentProfileQuery();
  const updateProfileMutation = useUpdateMyStudentProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const displayName =
    name !== null
      ? name
      : profile
        ? `${profile.firstName} ${profile.lastName}`
        : "";
  const displayEmail = email !== null ? email : profile?.email || "";
  const phone = "+";

  const handleSaveProfile = async () => {
    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
        email: displayEmail || undefined,
      });

      setName(null);
      setEmail(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleChangePassword = async () => {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#15141D]">
        <div className="px-4 sm:px-6 lg:px-10 min-h-screen flex flex-col">
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
      <div className="min-h-screen bg-[#15141D]">
        <div className="px-4 sm:px-6 lg:px-10 min-h-screen flex flex-col">
          <div className="pt-6 sm:pt-8 lg:pt-10 flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12">
              My profile
            </h1>
            <div className="text-white">
              Error loading profile. Please try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15141D]">
      <div className="px-4 sm:px-6 lg:px-10 min-h-screen flex flex-col">
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
                onNameChange={setName}
                onEdit={() => setIsEditing(true)}
                onSave={handleSaveProfile}
              />
              <ProfileContactFields
                email={displayEmail}
                phone={phone}
                isEditing={isEditing}
                onEmailChange={setEmail}
                onPhoneChange={() => {}}
                onFocusField={() => setIsEditing(true)}
                onChangePassword={() => setIsPasswordModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};
