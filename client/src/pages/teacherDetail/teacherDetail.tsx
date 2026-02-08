import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button/Button";
import { TeacherCard } from "../../components/teacherCard/teacherCard";
import { TeacherNavigation } from "../../components/teacherSection/teacherNavigation/TeacherNavigation";
import TeacherSubjects from "../../components/teacherSection/teacherSubjects/teacherSubjects";
import TeacherAbout from "../../components/teacherSection/teacherAbout/teacherAbout";
import TeacherSchedule from "../../components/teacherSection/teacherSchedule/TeacherSchedule";
import { useState } from "react";
import { ReviewsTeacher } from "../../components/teacherSection/Reviews/ReviewsTeacher";
import { useTeacherQuery } from "../../features/teachers/query/useTeacherQuery";

type TabType = "about" | "subjects" | "schedule";

export const TeacherDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("subjects");

  const { data: teacher, isLoading, error } = useTeacherQuery(id || "");

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
        return <TeacherSchedule teacher={teacher} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-auto">
        <div className="pt-20 container-centered mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="section-spacing">
            <div className="text-white text-center">Loading teacher...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="h-auto">
        <div className="pt-20 container-centered mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="section-spacing">
            <Button variant="secondary" onClick={handleBack} className="h-auto">
              Back
            </Button>
          </div>
          <div className="section-spacing">
            <div className="text-white text-center">Teacher not found</div>
          </div>
        </div>
      </div>
    );
  }

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
