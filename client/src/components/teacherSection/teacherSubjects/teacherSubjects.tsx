import { useState } from "react";
import { TeacherType } from "../../../api/teacher/teacher.type";

type TeacherSubjectsProps = {
  teacher?: TeacherType;
};

export default function TeacherSubjects({ teacher }: TeacherSubjectsProps) {
  const subjects = teacher?.subjects || [];
  const [activeSubjectId, setActiveSubjectId] = useState(
    subjects[0]?._id || "",
  );

  const currentSubject = subjects.find((s) => s._id === activeSubjectId);

  if (!teacher || subjects.length === 0) {
    return (
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Subjects</h2>
            <p className="text-white mt-8">No subjects available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Subjects</h2>

            <div className="flex gap-10 flex-wrap mt-8">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className={`pb-2 cursor-pointer transition-colors ${
                    activeSubjectId === subject._id
                      ? "border-b border-white"
                      : ""
                  }`}
                  onClick={() => setActiveSubjectId(subject._id)}
                >
                  <p
                    className={`text-lg transition-colors ${
                      activeSubjectId === subject._id
                        ? "text-[#7186FF]"
                        : "text-white hover:text-[#7186FF]"
                    }`}
                  >
                    {subject.subjectName}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              {currentSubject && (
                <div className="text-white space-y-4">
                  <p>
                    {currentSubject.description || "No description available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
