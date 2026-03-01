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
import { useRegularStudentsQuery } from "../../../features/appointments/query/useRegularStudentsQuery";
import { useModalStore } from "../../../store/modals.store";
import { queryKeys } from "../../../features/queryKeys";

export type { LessonPrice } from "../../../components/teacherProfileSection/types";

import { updatePasswordApi } from "../../../api/auth/auth.api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

export interface TimeSlot {
  day: string;
  hour: number;
}

export const TeacherProfile = () => {
  const { data: profile, isLoading } = useMyProfileQuery();
  const updateProfileMutation = useUpdateMyProfileMutation();
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
          queryKey: queryKeys.teacher(profile.id),
        });
      }

      openModal("alert", {
        title: "Success",
        message: "Schedule saved successfully",
      });
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { errorsMessages?: Array<{ message: string }> } };
      };
      openModal("alert", {
        title: "Error",
        message:
          axiosError?.response?.data?.errorsMessages?.[0]?.message ||
          "Failed to save schedule. Please try again.",
      });
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-8 sm:mb-10 lg:mb-12">
          My profile
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <ProfileAvatar avatarUrl={profile?.profileImageUrl} />
          <div className="flex-1 space-y-4 sm:space-y-6">
            <ProfileHeader
              name={name}
              isEditing={isEditing}
              onNameChange={setName}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
            />
            <ProfileContactFields
              email={email}
              phone={phone}
              isEditing={isEditing}
              onEmailChange={setEmail}
              onPhoneChange={setPhone}
              onFocusField={() => setIsEditing(true)}
              onChangePassword={() => setIsPasswordModalOpen(true)}
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
            onAboutMeChange={setAboutMe}
            onFocus={() => setIsEditing(true)}
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
