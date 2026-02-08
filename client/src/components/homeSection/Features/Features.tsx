import { FeatureCard } from "./FeatureCard";
import { Button } from "../../ui/button/Button";
import HomeSection1Icon from "../../icons/HomeSection1Icon";
import HomeSection1Icon2 from "../../icons/HomeSection1Icon2";
import HomeSection1Icon3 from "../../icons/HomeSection1Icon3";

const features = [
  {
    icon: <HomeSection1Icon />,
    title: "Trusted tutors",
    description:
      "All tutors are carefully selected and verified to ensure high teaching quality and a safe learning experience.",
  },
  {
    icon: <HomeSection1Icon2 />,
    title: "Simple process",
    description:
      "Find a tutor, book a session, and start learning in just a few clicks – no complicated steps or confusion.",
  },
  {
    icon: <HomeSection1Icon3 />,
    title: "Real results",
    description:
      "Students see progress faster thanks to focused sessions and tutors who know how to explain things clearly.",
  },
];

export const Features = () => {
  return (
    <section className="section-spacing py-12 sm:py-16 lg:py-20">
      <div className="container-centered mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="text-blue-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4">
            For Students
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Why students choose our tutors
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Unleash innovation and accelerate growth with our dynamic product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              className={
                index === 2
                  ? "md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:max-w-none lg:mx-0"
                  : ""
              }
            />
          ))}
        </div>

        <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
          <Button variant="secondary">More</Button>
        </div>
      </div>
    </section>
  );
};
