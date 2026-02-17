import { useState } from "react";
import type { LessonPrice } from "../../../components/teacherProfileSection/types";
import { ProfileAvatar } from "../../../components/teacherProfileSection/ProfileAvatar";
import { ProfileHeader } from "../../../components/teacherProfileSection/ProfileHeader";
import { ProfileContactFields } from "../../../components/teacherProfileSection/ProfileContactFields";
import { LessonsSection } from "../../../components/teacherProfileSection/LessonsSection";
import { ProfileExperienceEducation } from "../../../components/teacherProfileSection/ProfileExperienceEducation";
import { ProfileAboutMe } from "../../../components/teacherProfileSection/ProfileAboutMe";
import { LessonSchedule } from "../../../components/teacherProfileSection/LessonSchedule";
import {
  mapUiSlotsToMergedWeekAvailability,
  mapWeekAvailabilityToUiSlots,
} from "./scheduleMappers";
import {
  updateMyWeeklyScheduleApi,
  getMyWeeklyScheduleApi,
} from "../../../api/teacher/teacher.api";

export type { LessonPrice } from "../../../components/teacherProfileSection/types";

export interface TimeSlot {
  day: string;
  hour: number;
}

export const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Anna Tkachuk");
  const [email, setEmail] = useState("daryna2003tk@gmail.com");
  const [phone, setPhone] = useState("+");
  const [lessons, setLessons] = useState<LessonPrice[]>([]);
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const [newSubject, setNewSubject] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(
    null,
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);

  const handleAddLesson = () => {
    if (newSubject && newLevel && newPrice) {
      setLessons([
        ...lessons,
        { subject: newSubject, level: newLevel, price: newPrice },
      ]);
      setNewSubject("");
      setNewLevel("");
      setNewPrice("");
      setShowAddForm(false);
    }
  };

  const handleEditLesson = (index: number) => {
    const lesson = lessons[index];
    setNewSubject(lesson.subject);
    setNewLevel(lesson.level);
    setNewPrice(lesson.price);
    setEditingLessonIndex(index);
    setShowAddForm(true);
  };

  const handleUpdateLesson = () => {
    if (editingLessonIndex !== null && newSubject && newLevel && newPrice) {
      const updatedLessons = [...lessons];
      updatedLessons[editingLessonIndex] = {
        subject: newSubject,
        level: newLevel,
        price: newPrice,
      };
      setLessons(updatedLessons);
      setEditingLessonIndex(null);
      setNewSubject("");
      setNewLevel("");
      setNewPrice("");
      setShowAddForm(false);
    }
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setNewSubject("");
    setNewLevel("");
    setNewPrice("");
    setEditingLessonIndex(null);
  };

  // Saves selected slots in state and sends weekly availability to the backend.
  const handleScheduleSave = async (slots: TimeSlot[]) => {
    setSchedule(slots); // keep local UI state
    const availability = mapUiSlotsToMergedWeekAvailability(slots);
    await updateMyWeeklyScheduleApi({ availability });
  };

  // Loads the saved weekly availability from backend, maps it to grid cells, then opens the schedule popup.
  const handleOpenSchedule = async () => {
    try {
      const availability = await getMyWeeklyScheduleApi();

      // convert backend weekly ranges to UI day/hour cells -{ day: "Monday", hour: 10 }- so saved slots are highlighted in the grid.
      setSchedule(mapWeekAvailabilityToUiSlots(availability));
    } catch (error) {
      console.error("Failed to load weekly availability", error);
    } finally {
      setIsScheduleOpen(true);
    }
  };

  return (
    <div className="min-h-screen pl-[218px] bg-[#15141D]">
      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <div className="pt-10 flex-1">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#7C86F7] to-[#E879F9] bg-clip-text text-transparent mb-12">
            My profile
          </h1>

          <div className="flex gap-12">
            <ProfileAvatar />
            <div className="flex-1 space-y-6">
              <ProfileHeader
                name={name}
                isEditing={isEditing}
                onNameChange={setName}
                onEdit={() => setIsEditing(true)}
                onSave={() => setIsEditing(false)}
              />
              <ProfileContactFields
                email={email}
                phone={phone}
                isEditing={isEditing}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                onFocusField={() => setIsEditing(true)}
              />
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <LessonsSection
              lessons={lessons}
              showAddForm={showAddForm}
              editingLessonIndex={editingLessonIndex}
              newSubject={newSubject}
              newLevel={newLevel}
              newPrice={newPrice}
              onShowAddForm={setShowAddForm}
              onNewSubjectChange={setNewSubject}
              onNewLevelChange={setNewLevel}
              onNewPriceChange={setNewPrice}
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

          <div className="mt-12 mb-12">
            <ProfileAboutMe
              aboutMe={aboutMe}
              isEditing={isEditing}
              onAboutMeChange={setAboutMe}
              onFocus={() => setIsEditing(true)}
            />
          </div>
        </div>
      </div>

      {/* When teacher clicks Save in this popup, we send the selected times to the backend */}
      <LessonSchedule
        key={JSON.stringify(schedule)} //  Re-create this popup when schedule changes, so the new saved times show correctly
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleScheduleSave}
        initialSlots={schedule}
      />
    </div>
  );
};
