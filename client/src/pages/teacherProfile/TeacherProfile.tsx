import { useState } from "react";
import {
  Sidebar,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/headerPrivate/TopBar";
import type { LessonPrice } from "../../components/teacherProfileSection/types";
import { ProfileAvatar } from "../../components/teacherProfileSection/ProfileAvatar";
import { ProfileHeader } from "../../components/teacherProfileSection/ProfileHeader";
import { ProfileContactFields } from "../../components/teacherProfileSection/ProfileContactFields";
import { LessonsSection } from "../../components/teacherProfileSection/LessonsSection";
import { ProfileExperienceEducation } from "../../components/teacherProfileSection/ProfileExperienceEducation";
import { ProfileAboutMe } from "../../components/teacherProfileSection/ProfileAboutMe";

export type { LessonPrice } from "../../components/teacherProfileSection/types";

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

  return (
    <div className="min-h-screen pl-[218px] bg-[#15141D]">
      <Sidebar items={defaultTeacherMenuItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

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
    </div>
  );
};
