import { ReviewCardTeacher } from "./ReviewCardTeacher";
import { Button } from "../../ui/button/Button";
import avatar1 from "../../../assets/images/Avatar.png";
import avatar2 from "../../../assets/images/Avatar2.png";
import avatar3 from "../../../assets/images/Avatar3.png";
import shapeImage from "../../../assets/images/Shape.png";

// TODO: Fetch reviews data from API instead of using hardcoded data.
// Temporary hardcoded reviews data

const reviews = [
  {
    avatar: null,
    name: "Cameron Williamson",
    course: "English",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 3.4,
  },
  {
    avatar: avatar2,
    name: "Esther Howard",
    course: "Dutch",

    rating: 4.0,
  },
  {
    avatar: avatar3,
    name: "Darrell Steward",
    course: "QA / Software Testing",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 4.8,
  },
  {
    avatar: avatar1,
    name: "Jacob Jones",
    course: "Spanish",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 4.2,
  },
  {
    avatar: avatar2,
    name: "Marvin McKinney",
    course: "French",
    review:
      "The classes are engaging and focused on real communication. Students see noticeable improvement.",
    rating: 3,
  },
];

export const ReviewsTeacher = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 section-spacing">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container-centered">
        <div className="text-center">
          <h2 className="mb-6 sm:mb-8 lg:mb-10 font-bold text-white xl:text-[56px] text-3xl sm:text-4xl lg:text-5xl">
            What our clients say
          </h2>
          <p className="mx-auto mb-12 sm:mb-16 lg:mb-20 px-4 max-w-3xl text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed">
            Students appreciate the practical approach, supportive instructors,
            and clear learning structure across all courses. Many international
            students highlight fast progress, increased confidence, and a
            comfortable learning environment.
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:gap-8 md:gap-8 lg:gap-12 w-full">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative flex justify-center px-[15px] sm:px-[10px] md:px-[5px] w-full"
            >
              <div className="z-10 relative w-full">
                <ReviewCardTeacher {...review} />
              </div>

              <img
                src={shapeImage}
                alt=""
                className="top-[8px] sm:top-[6px] md:top-[4px] lg:top-[10px] -right-[30px] sm:-right-[25px] md:-right-[20px] lg:-right-[50px] -bottom-[3px] sm:-bottom-[5px] md:-bottom-[7px] lg:-bottom-[5px] -left-[0px] sm:-left-[2px] md:-left-[5px] lg:-left-[0px] z-0 absolute rounded-2xl w-[calc(100%+30px)] sm:w-[calc(100%+27px)] md:w-[calc(100%+25px)] lg:w-[calc(100%+50px)] h-[calc(100%+11px)] sm:h-[calc(100%+11px)] md:h-[calc(100%+11px)] lg:h-[calc(100%+15px)] object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 sm:mt-16 md:mt-20 lg:mt-12">
          <Button variant="secondary">More</Button>
        </div>
      </div>
    </section>
  );
};
