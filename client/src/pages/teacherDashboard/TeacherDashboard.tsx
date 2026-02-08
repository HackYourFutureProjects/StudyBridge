import { MyLessonsSection } from "../../components/teacherDashboard/MyLessonsSection";
import {
  Sidebar,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/headerPrivate/TopBar";

export const TeacherDashboard = () => {
  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={defaultTeacherMenuItems} />

      <div className="px-6 lg:px-10">
        <TopBar />

        <div className="pt-[40px]">
          <div className="mt-0">
            <MyLessonsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
