import { SubjectCard } from "./SubjectCard";
import { Button } from "../../ui/button/Button";
import bgImage from "../../../assets/images/bg-popular-subjects.png";
import { SubjectsType } from "../../../api/subjects/subjects.type.ts";
import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../../router/routesVariables/pathVariables.ts";
import { SubjectCardsSkeletonList } from "../../skeletons/SubjectsSceleton.tsx";

type PopularSubjectsProps = {
  subjects?: SubjectsType[];
  isLoading?: boolean;
};

export const PopularSubjects = ({
  subjects = [],
  isLoading,
}: PopularSubjectsProps) => {
  const subjectLabels = subjects.map((s) => s.name).slice(0, 5);
  const isEmpty = !isLoading && subjectLabels.length === 0;
  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="absolute inset-0 z-0 px-4 sm:px-6 lg:px-8 hidden xl:block">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 container-centered mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10 md:pr-8 lg:text-left lg:ml-12 lg:pr-8 max-[1166px]:text-center max-[1166px]:pr-0 max-[1166px]:ml-0 min-[1167px]:text-right min-[1167px]:pr-8 min-[1167px]:ml-0">
            <span className="text-gradient">Popular subjects & Languages</span>
          </h2>

          <p className="text-white/70 text-base sm:text-lg text-center max-w-67 leading-relaxed mb-7">
            On our platform, you can learn a wide range of foreign languages and
            programming subjects — all in one place.
          </p>

          <Button variant="secondary" className="mb-8">
            Start
          </Button>

          <div className="flex flex-col gap-3.5 w-full max-w-md md:pr-8 lg:text-left lg:ml-12 lg:pr-8 max-[1166px]:text-center max-[1166px]:pr-0 max-[1166px]:ml-0 min-[1167px]:text-right min-[1167px]:pr-8 min-[1167px]:ml-0">
            {isLoading ? (
              <SubjectCardsSkeletonList count={5} />
            ) : isEmpty ? (
              <div className="card-subject">
                <p className="text-white/70 text-center">No subjects yet</p>
              </div>
            ) : (
              subjectLabels.map((subject) => (
                <SubjectCard key={subject} title={subject} />
              ))
            )}
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-[64px] items-start max-w-7xl mx-auto">
          <div className="flex flex-col gap-[350px] -mt-[60px]">
            <div className="mt-[20px]">
              <p className="text-white/70 text-base w-[270px] h-[108px] leading-relaxed mb-[24px]">
                On our platform, you can learn a wide range of foreign languages
                and programming subjects — all in one place.
              </p>
              <Button
                as={NavLink}
                to={publicRoutesVariables.teachers}
                variant="secondary"
              >
                Tutors
              </Button>
            </div>

            <h2 className="text-[74px] font-bold w-[394px] leading-tight">
              <span className="text-gradient">
                Popular subjects & Languages
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-[32px]">
            {isLoading ? (
              <SubjectCardsSkeletonList count={5} />
            ) : isEmpty ? (
              <div className="card-subject">
                <p className="text-white/70 text-center">No subjects yet</p>
              </div>
            ) : (
              subjectLabels.map((subject) => (
                <SubjectCard key={subject} title={subject} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
