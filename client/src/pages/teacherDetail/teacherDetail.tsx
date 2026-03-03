import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button/Button";
import { TeacherCard } from "../../components/teacherCard/teacherCard";
import { TeacherNavigation } from "../../components/teacherSection/teacherNavigation/TeacherNavigation";
import TeacherSubjects from "../../components/teacherSection/teacherSubjects/teacherSubjects";
import TeacherAbout from "../../components/teacherSection/teacherAbout/teacherAbout";
import TeacherSchedule from "../../components/teacherSection/teacherSchedule/TeacherSchedule";
import { useState } from "react";
import { useTeacherQuery } from "../../features/teachers/query/useTeacherQuery";
import { TeacherCardSkeleton } from "../../components/skeletons/TeacherCardSkeleton";
import { ReviewsManager } from "../../components/teacherSection/Reviews/ReviewsManager";
import { useMatch } from "react-router-dom";
import { useChangeStatusMutation } from "../../features/moderator/mutation/useChangeStatus.ts";
import { TeacherStatus } from "../../api/teacher/teacher.type.ts";
type TabType = "about" | "subjects" | "schedule";

export const TeacherDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("subjects");
  const isModeratorRoute = Boolean(useMatch("/moderator/*"));
  const { data: teacher, isLoading, error } = useTeacherQuery(id || "");
  const { mutate: changeStatusMutation, isPending: isChangeStatusPrnding } =
    useChangeStatusMutation();
  const changeStatus = (id: string, status: TeacherStatus) => {
    changeStatusMutation({ id, status });
  };
  const handleBack = () => {
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "subjects":
        return <TeacherSubjects teacher={teacher} />;
      case "about":
        return <TeacherAbout teacher={teacher} />;
      case "schedule":
        return <TeacherSchedule teacher={teacher} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-auto min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-20 max-w-6xl container-centered">
          <div className="section-spacing">
            <Button variant="secondary" onClick={handleBack} className="h-auto">
              Back
            </Button>
          </div>
          <TeacherCardSkeleton />
          <div className="section-spacing">
            <div className="bg-[#15141D80] rounded-lg h-12 animate-pulse"></div>
          </div>
          <div className="section-spacing">
            <div className="bg-[#15141D80] rounded-3xl h-96 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="h-auto min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-20 max-w-6xl container-centered">
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
    <div className="h-auto min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-20 max-w-6xl container-centered">
        <div className="section-spacing">
          <Button variant="secondary" onClick={handleBack} className="h-auto">
            Back
          </Button>
        </div>
        <TeacherCard
          teacher={teacher}
          showBookButton={false}
          changeStatus={isModeratorRoute ? changeStatus : undefined}
          isStatusPending={isModeratorRoute ? isChangeStatusPrnding : undefined}
        />
        <div className="section-spacing">
          <TeacherNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="section-spacing">{renderContent()}</div>
        <section className="z-10 relative bg-bg-main section-spacing">
          <ReviewsManager />
        </section>
      </div>
    </div>
  );
};
