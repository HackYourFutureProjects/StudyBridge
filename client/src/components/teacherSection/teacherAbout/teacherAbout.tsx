import { useState } from "react";

export type AboutType = {
  id: string;
  description: string;
};

const about: AboutType[] = [
  {
    id: "about",
    description:
      "I am a dedicated language tutor specializing in the Dutch language, English language, and French language. I have a strong passion for teaching and helping students achieve confidence in using foreign languages. My lessons are well-structured, clear, and adapted to each student's learning style and goals. I focus on developing all core skills, including speaking, listening, grammar, and vocabulary. Practical language use is a key part of my teaching approach. I believe that learning a language should be engaging, supportive, and motivating. I work with beginners as well as intermediate learners. I carefully explain complex topics in a simple and understandable way. My goal is to help students overcome language barriers and feel comfortable communicating. I always strive to create a positive and encouraging learning environment.",
  },
];

export default function TeacherAbout() {
  const [activeAbout] = useState("about");

  const currentAbout = about.find((item) => item.id === activeAbout);

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">About</h2>

            <div className="mt-8">
              {currentAbout && (
                <div className="text-white space-y-4">
                  <p>{currentAbout.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
