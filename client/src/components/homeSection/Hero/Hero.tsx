import heroImage from "../../../assets/images/hero.png";
import { SelectComponent } from "../../ui/select/select";
import { Button } from "../../ui/button/Button";
import { subjects } from "../../../constants/subjects";

export const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Students learning together"
          className="w-full h-full object-cover object-top scale-110"
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

        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-2xl lg:max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[620px] h-[80px] bg-[#27222EB3] rounded-[60px] -z-10"></div>
          <SelectComponent
            options={subjects}
            defaultValue="english"
            onChange={() => {}}
            className="w-full sm:w-auto"
          />
          <Button variant="secondary">Search</Button>
        </div>
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
