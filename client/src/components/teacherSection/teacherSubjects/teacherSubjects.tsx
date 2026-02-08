import { useState } from "react";

export type SubjectType = {
  id: string;
  name: string;
  description: string;
  levels: string;
  focus: string[];
};

const subjects: SubjectType[] = [
  {
    id: "dutch",
    name: "Dutch language",
    description:
      "I teach Dutch for beginners and intermediate learners. Lessons focus on building a strong foundation in grammar and vocabulary, with special attention to pronunciation and everyday communication. The learning process is clear, supportive, and adapted to the student's goals and pace.",
    levels: "A1–A2",
    focus: [
      "Beginner to Intermediate",
      "Levels A1–A2",
      "Conversational Dutch",
      "Basic grammar and vocabulary",
      "Support for those starting from zero",
    ],
  },
  {
    id: "english",
    name: "English language",
    description:
      "I teach English for all levels from beginners to advanced learners. My approach focuses on practical communication, business English, and exam preparation. Each lesson is designed to build confidence and fluency in real-world situations.",
    levels: "A1–C2",
    focus: [
      "Beginner to Advanced",
      "Levels A1–C2",
      "Business English",
      "IELTS/TOEFL preparation",
      "Conversational fluency",
    ],
  },
  {
    id: "french",
    name: "French language",
    description:
      "I teach French with emphasis on conversational skills and cultural understanding. Perfect for travel, business, or academic purposes. Lessons include grammar, vocabulary, and pronunciation with a focus on practical usage.",
    levels: "A1–B2",
    focus: [
      "Beginner to Intermediate",
      "Levels A1–B2",
      "Travel French",
      "Business communication",
      "Cultural immersion",
    ],
  },
];

export default function TeacherSubjects() {
  const [activeLanguage, setActiveLanguage] = useState("dutch");

  const currentSubject = subjects.find(
    (subject) => subject.id === activeLanguage,
  );

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Subjects</h2>

            <div className="flex gap-10 flex-wrap mt-8">
              {subjects.map((lang) => (
                <div
                  key={lang.id}
                  className={`pb-2 cursor-pointer transition-colors ${
                    activeLanguage === lang.id ? "border-b border-white" : ""
                  }`}
                  onClick={() => setActiveLanguage(lang.id)}
                >
                  <p
                    className={`text-lg transition-colors ${
                      activeLanguage === lang.id
                        ? "text-[#7186FF]"
                        : "text-white hover:text-[#7186FF]"
                    }`}
                  >
                    {lang.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              {currentSubject && (
                <div className="text-white space-y-4">
                  <p>{currentSubject.description}</p>
                  <p>Teaching levels and focus:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    {currentSubject.focus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
