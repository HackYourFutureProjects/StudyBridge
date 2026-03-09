import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LessonPrice } from "../../../components/teacherProfileSection/types";
import { ProfileAvatar } from "../../../components/teacherProfileSection/ProfileAvatar";
import { ProfileHeader } from "../../../components/teacherProfileSection/ProfileHeader";
import { ProfileContactFields } from "../../../components/teacherProfileSection/ProfileContactFields";
import { LessonsSection } from "../../../components/teacherProfileSection/LessonsSection";
import { ProfileExperienceEducation } from "../../../components/teacherProfileSection/ProfileExperienceEducation";
import { ProfileAboutMe } from "../../../components/teacherProfileSection/ProfileAboutMe";
import { LessonSchedule } from "../../../components/teacherProfileSection/LessonSchedule";
import { ChangePasswordModal } from "../../../components/changePasswordModal/ChangePasswordModal";
import {
  mapUiSlotsToMergedWeekAvailability,
  mapWeekAvailabilityToUiSlots,
} from "./scheduleMappers";
import {
  updateMyWeeklyScheduleApi,
  getMyWeeklyScheduleApi,
} from "../../../api/teacher/teacher.api";
import { useMyProfileQuery } from "../../../features/teachers/query/useMyProfileQuery";
import { useUpdateMyProfileMutation } from "../../../features/teachers/mutations/useUpdateMyProfileMutation";
import { useUpdateMyPublishMutation } from "../../../features/teachers/mutations/useUpdateMyPublishMutation";

import { useRegularStudentsQuery } from "../../../features/appointments/query/useRegularStudentsQuery";
import { useModalStore } from "../../../store/modals.store";
import { queryKeys } from "../../../features/queryKeys";

export type { LessonPrice } from "../../../components/teacherProfileSection/types";

import { updatePasswordApi } from "../../../api/auth/auth.api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { teacherProfileSchema } from "../../../components/teacherProfileSection/teacherProfile.validation";

export interface TimeSlot {
  day: string;
  hour: number;
}

const teacherStatusUi: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  },
  pending: {
    label: "Pending Review",
    className: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
  },
  active: {
    label: "Approved",
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/20 text-red-300 border border-red-500/40",
  },
  blocked: {
    label: "Blocked",
    className: "bg-gray-500/20 text-gray-200 border border-gray-500/40",
  },
};

export const TeacherProfile = () => {
  const { data: profile, isLoading } = useMyProfileQuery();
  const updateProfileMutation = useUpdateMyProfileMutation();

  const { mutate: updatePublish, isPending: isPublishPending } =
    useUpdateMyPublishMutation();

  const handlePublishToggle = (nextPublic: boolean) =>
    updatePublish({ isPublic: nextPublic });

  const { data: regularStudentsData } = useRegularStudentsQuery();
  const openModal = useModalStore((s) => s.open);
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lessons, setLessons] = useState<LessonPrice[]>([]);
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    phone?: string;
    aboutMe?: string;
  }>({});

  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLevels, setNewLevels] = useState<
    Array<{ level: string; price: string }>
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(
    null,
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

  const handleAboutMeChange = (value: string) => {
    setAboutMe(value);
    clearFieldError("aboutMe");
  };

  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  useEffect(() => {
    if (profile) {
      setName(`${profile.firstName} ${profile.lastName}`);
      setEmail(profile.email);
      setPhone(profile.phoneNumber || "+");
      setExperience(profile.experience?.toString() || "");
      setEducation(
        profile.education.length > 0 ? profile.education[0].degree : "",
      );
      setAboutMe(profile.bio || "");
      setLessons(
        profile.subjects.map((s) => ({
          subject: s.subjectName,
          description: s.description || "",
          levels:
            Array.isArray(s.levels) && s.levels.length > 0
              ? s.levels.map((l) => {
                  if (typeof l === "string") {
                    return {
                      level: l,
                      price: s.hourlyRate.toString(),
                    };
                  }
                  return {
                    level: l.level,
                    price: l.price.toString(),
                  };
                })
              : [],
        })),
      );
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    const formData = {
      name: name.trim(),
      phone: phone.trim(),
      aboutMe: aboutMe.trim(),
    };

    const validation = teacherProfileSchema.safeParse(formData);

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

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
        email: email || undefined,
        phoneNumber: phone !== "+" ? phone : undefined,
        experience: experience ? parseInt(experience) : undefined,
        bio: aboutMe || undefined,
        education: education
          ? [
              {
                degree: education,
                institution: education,
              },
            ]
          : undefined,
        subjects: lessons.map((l) => {
          const minPrice =
            l.levels.length > 0
              ? Math.min(...l.levels.map((lv) => parseFloat(lv.price)))
              : 0;

          return {
            subjectName: l.subject,
            description: l.description,
            levels: l.levels.map((lv) => ({
              level: lv.level,
              price: parseFloat(lv.price),
            })),
            experienceYears: experience ? parseInt(experience) : 0,
            hourlyRate: minPrice,
          };
        }),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleAddLesson = () => {
    if (lessons.length >= 5) {
      openModal("alert", {
        title: "Maximum Subjects Reached",
        message: "You can add maximum 5 subjects",
      });
      return;
    }

    if (!newSubject || !newDescription) {
      openModal("alert", {
        title: "Missing Information",
        message: "Please fill in subject and description",
      });
      return;
    }

    if (newLevels.length === 0) {
      openModal("alert", {
        title: "Missing Level",
        message: "Please add at least one level with price",
      });
      return;
    }

    const isDuplicate = lessons.some(
      (lesson) => lesson.subject.toLowerCase() === newSubject.toLowerCase(),
    );

    if (isDuplicate) {
      openModal("alert", {
        title: "Duplicate Subject",
        message: `You already have ${newSubject} in your lessons. Please choose a different subject.`,
      });
      return;
    }

    const newLesson = {
      subject: newSubject,
      description: newDescription,
      levels: newLevels,
    };

    setLessons([...lessons, newLesson]);
    setNewSubject("");
    setNewDescription("");
    setNewLevels([]);
    setShowAddForm(false);
    setIsEditing(true);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const handleEditLesson = (index: number) => {
    const lesson = lessons[index];
    setNewSubject(lesson.subject);
    setNewDescription(lesson.description);
    setNewLevels(lesson.levels);
    setEditingLessonIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateLesson = () => {
    if (!newSubject || !newDescription) {
      openModal("alert", {
        title: "Missing Information",
        message: "Please fill in subject and description",
      });
      return;
    }

    if (newLevels.length === 0) {
      openModal("alert", {
        title: "Missing Level",
        message: "Please add at least one level with price",
      });
      return;
    }

    if (editingLessonIndex === null) return;

    const isDuplicate = lessons.some(
      (lesson, index) =>
        index !== editingLessonIndex &&
        lesson.subject.toLowerCase() === newSubject.toLowerCase(),
    );

    if (isDuplicate) {
      openModal("alert", {
        title: "Duplicate Subject",
        message: `You already have ${newSubject} in your lessons. Please choose a different subject.`,
      });
      return;
    }

    const updatedLessons = [...lessons];
    updatedLessons[editingLessonIndex] = {
      subject: newSubject,
      description: newDescription,
      levels: newLevels,
    };
    setLessons(updatedLessons);
    setEditingLessonIndex(null);
    setNewSubject("");
    setNewDescription("");
    setNewLevels([]);
    setShowAddForm(false);
    setIsEditing(true);
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setNewSubject("");
    setNewDescription("");
    setNewLevels([]);
    setEditingLessonIndex(null);
  };

  const handleScheduleSave = async (slots: TimeSlot[]) => {
    try {
      setSchedule(slots);
      const availability = mapUiSlotsToMergedWeekAvailability(slots);

      await updateMyWeeklyScheduleApi({ availability });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.teachers.myProfile(),
      });

      if (profile?.id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.teacherPublic(profile.id),
        });
      }

      success("Schedule saved successfully!");
    } catch (error) {
      console.error("Schedule save error:", error);
      const axiosError = error as {
        response?: { data?: { errorsMessages?: Array<{ message: string }> } };
      };
      notifyError(
        axiosError?.response?.data?.errorsMessages?.[0]?.message ||
          "Failed to save schedule. Please try again.",
      );
    }
  };

  const handleOpenSchedule = async () => {
    try {
      const availability = await getMyWeeklyScheduleApi();
      setSchedule(mapWeekAvailabilityToUiSlots(availability));
    } catch (error) {
      console.error("Failed to load weekly availability", error);
    } finally {
      setIsScheduleOpen(true);
    }
  };

  const getBookedSlots = (): TimeSlot[] => {
    const regularStudents = regularStudentsData?.appointments || [];
    const regularSlots: TimeSlot[] = [];
    regularStudents.forEach((student) => {
      if (student.weeklySchedule && Array.isArray(student.weeklySchedule)) {
        student.weeklySchedule.forEach((slot) => {
          regularSlots.push({
            day: slot.day,
            hour: slot.hour,
          });
        });
      }
    });
    return regularSlots;
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

  return (
    <div className="px-4 sm:px-6 lg:px-10 flex flex-col">
      <div className="pt-6 sm:pt-8 lg:pt-10 flex-1">
        <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent">
            My profile
          </h1>
          <label
            htmlFor="teacher-visibility-toggle"
            className={`flex items-center gap-3 ${
              isPublishPending ? "opacity-70" : ""
            }`}
          >
            <span className="text-red-400 text-sm">Private profile</span>
            <input
              id="teacher-visibility-toggle"
              type="checkbox"
              className="peer sr-only"
              checked={Boolean(profile?.isPublic)}
              disabled={isPublishPending}
              onChange={(e) => handlePublishToggle(e.target.checked)}
            />
            <span
              className="relative h-7 w-14 cursor-pointer rounded-full bg-red-500 transition-colors duration-200
              peer-checked:bg-green-500 peer-disabled:cursor-not-allowed
              after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow
              after:transition-transform after:duration-200 peer-checked:after:translate-x-7"
              aria-hidden="true"
            />
            <span className="text-green-400 text-sm">Public profile</span>
          </label>
        </div>
        <div className="mb-6 sm:mb-8">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${
              teacherStatusUi[profile?.status ?? "draft"]?.className ??
              "bg-light-500/20 text-light-100 border border-light-500/40"
            }`}
          >
            Account status:{" "}
            {teacherStatusUi[profile?.status ?? "draft"]?.label ??
              profile?.status ??
              "Draft"}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <ProfileAvatar avatarUrl={profile?.profileImageUrl} />
          <div className="flex-1 space-y-4 sm:space-y-6">
            <ProfileHeader
              name={name}
              isEditing={isEditing}
              onNameChange={handleNameChange}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              error={validationErrors.name}
            />
            <ProfileContactFields
              email={email}
              phone={phone}
              isEditing={isEditing}
              onPhoneChange={handlePhoneChange}
              onFocusField={() => setIsEditing(true)}
              onChangePassword={() => setIsPasswordModalOpen(true)}
              phoneError={validationErrors.phone}
            />
          </div>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 space-y-4 sm:space-y-6">
          <LessonsSection
            lessons={lessons}
            showAddForm={showAddForm}
            editingLessonIndex={editingLessonIndex}
            newSubject={newSubject}
            newDescription={newDescription}
            newLevels={newLevels}
            onShowAddForm={setShowAddForm}
            onNewSubjectChange={setNewSubject}
            onNewDescriptionChange={setNewDescription}
            onNewLevelsChange={setNewLevels}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onEditLesson={handleEditLesson}
            onRemoveLesson={handleRemoveLesson}
            onCancelForm={handleCancelForm}
          />

          <ProfileExperienceEducation
            experience={experience}
            education={education}
            isEditing={isEditing}
            onExperienceChange={setExperience}
            onEducationChange={setEducation}
            onRowClick={() => setIsEditing(true)}
            onScheduleClick={handleOpenSchedule}
          />
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12 mb-8 sm:mb-10 lg:mb-12">
          <ProfileAboutMe
            aboutMe={aboutMe}
            isEditing={isEditing}
            onAboutMeChange={handleAboutMeChange}
            onFocus={() => setIsEditing(true)}
            error={validationErrors.aboutMe}
          />
        </div>
      </div>

      <LessonSchedule
        key={JSON.stringify(schedule)}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleScheduleSave}
        initialSlots={schedule}
        bookedSlots={getBookedSlots()}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};
