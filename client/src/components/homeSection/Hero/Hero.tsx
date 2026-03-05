import heroImage from "../../../assets/images/hero.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../../hooks/useMediaQuery.tsx";
import { SearchPanel } from "../../searchPanel/SearchPanel.tsx";
import { SubjectsType } from "../../../api/subjects/subjects.type.ts";
type HeroProps = {
  onLoaded: () => void;
  subjects?: SubjectsType[];
};

export const Hero = ({ onLoaded, subjects }: HeroProps) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [subject, setSubject] = useState<string>("");

  const onSearch = () => {
    navigate(`/teachers?subject=${encodeURIComponent(subject)}`);
  };
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Students learning together"
          className="w-full h-full object-cover object-top scale-110"
          onLoad={onLoaded}
          onError={onLoaded}
        />
      </div>

      <div className="relative z-10 container-centered mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6">
          Need a tutor?
        </h1>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 lg:mb-6">
          <span className="text-gradient">
            Choose the best with StudyBridge!
          </span>
        </h2>

        <p className="text-white/90 text-sm sm:text-base lg:text-lg xl:text-xl mb-8 sm:mb-12 lg:mb-16 max-w-2xl mx-auto px-4">
          Quickly choose, pay, and receive a video call with your tutor!
        </p>

        <SearchPanel
          isMobile={isMobile}
          onSearch={onSearch}
          setSubject={setSubject}
          subject={subject}
          subjects={subjects}
        />
      </div>

      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-10">
        <p className="text-white/70 text-xs sm:text-sm text-center px-4 sm:px-6 lg:px-8 tracking-wider uppercase">
          Trusted by thousands of students worldwide who choose us for quality,
          convenience, and real results.
        </p>
      </div>
    </section>
  );
};
