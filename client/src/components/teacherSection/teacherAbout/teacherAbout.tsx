import { TeacherType } from "../../../api/teacher/teacher.type";

type TeacherAboutProps = {
  teacher?: TeacherType;
};

export default function TeacherAbout({ teacher }: TeacherAboutProps) {
  const bio = teacher?.bio || "No information available";

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">About</h2>

            <div className="mt-8">
              <div className="text-white space-y-4">
                <p>{bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
