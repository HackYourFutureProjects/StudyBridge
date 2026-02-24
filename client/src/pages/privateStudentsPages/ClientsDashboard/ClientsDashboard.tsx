import { MyLessonsSection } from "../../../components/clientsDashboard/MyLessonsSection";

export const ClientsDashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10">
        <div className="pt-[40px]">
          <div className="mt-0">
            <MyLessonsSection />
          </div>
        </div>
      </div>
    </div>
  );
};
