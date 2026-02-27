import { MyLessonsSection } from "../../../components/teacherDashboard/MyLessonsSection";

export const TeacherDashboard = () => {
  return (
    <div>
      <div className="px-6 lg:px-10">
        <div className="pt-10">
          <div className="mt-0">
            <MyLessonsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
