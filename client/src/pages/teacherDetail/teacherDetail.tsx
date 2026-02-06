import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button/Button";
import { TeacherCard } from "../../components/teacherCard/teacherCard";
import { TeacherNavigation } from "../../components/teacher-section/teacherNavigation/TeacherNavigation";
import TeacherSubjects from "../../components/teacher-section/teacherSubjects/teacherSubjects";
import TeacherAbout from "../../components/teacher-section/teacherAbout/teacherAbout";
import TeacherSchedule from "../../components/teacher-section/teacherSchedule/TeacherSchedule";
import { useState } from "react";
import Person from "../../assets/images/person.jpg";
import { TeacherType } from "../../types/teacher.types";
import { ReviewsTeacher } from "../../components/teacher-section/Reviews/ReviewsTeacher";

const teacher: TeacherType = {
  id: "1",
  name: "Els Menson",
  subject: "English",
  price: 35,
  image: Person,
  experience: "12 years",
  education: "University of Amsterdam",
  approaching:
    "Communicative, student-centered methodology focused on real-life English. Lessons emphasize speaking practice, practical vocabulary, and personalized learning goals.",
};

type TabType = "about" | "subjects" | "schedule";

export const TeacherDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("subjects");

  const handleBack = () => {
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "subjects":
        return <TeacherSubjects />;
      case "about":
        return <TeacherAbout />;
      case "schedule":
        return <TeacherSchedule />;
      default:
        return null;
    }
  };

  return (
    <div className="h-auto">
      <div className="pt-20 container-centered mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="section-spacing">
          <Button variant="secondary" onClick={handleBack} className="h-auto">
            Back
          </Button>
        </div>
        <TeacherCard teacher={teacher} />
        <div className="section-spacing">
          <TeacherNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="section-spacing">{renderContent()}</div>
        <section className="section-spacing relative z-10 bg-bg-main">
          <ReviewsTeacher />
        </section>
      </div>
    </div>
  );
};
