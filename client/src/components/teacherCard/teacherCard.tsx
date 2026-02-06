import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { TeacherType } from "../../types/teacher.types";

type TeacherCardType = {
  teacher: TeacherType;
};

export const TeacherCard = ({ teacher }: TeacherCardType) => {
  const { name, subject, image, experience, education, price, approaching } =
    teacher;

  return (
    <div className="flex flex-col md:flex-row border bg-[#15141D80] border-blue-500 px-[36px] py-[36px] rounded-[25px]">
      <div className="flex flex-col md:flex-row gap-[15px] md:border-r border-[#ffffff10] md:pr-[23px]">
        <div className="flex flex-col gap-[15px]">
          <div
            className="md:block md:w-[150px] md:h-[150px] lg:w-[173px] lg:h-[173px] overflow-hidden rounded-[25px]

                             "
          >
            <img
              className="w-full h-full object-cover"
              src={image}
              alt="person"
            />
          </div>
          <div className="pb-[9px] border-b border-light-200">
            <p className="text-light-100 text-[18px]">{name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          <span
            className="inline-flex w-fit
                        shrink-0 border border-light-300 text-[12px] md:text-[12px] text-light-100 rounded-full bg-dark-900
                        px-[35px] py-[2px]"
          >
            {subject} teacher
          </span>
          <div className="flex flex-col gap-[20px] w-full max-w-[465px]">
            <p className="text-[14px] text-light-100">
              Experience — {experience}
            </p>
            <p className="text-[14px] text-light-100">
              Education — {education}
            </p>
            <p
              className="text-[14px] text-light-100
                                overflow-hidden
                                [display:-webkit-box]
                                [-webkit-box-orient:vertical]
                                [-webkit-line-clamp:3]
                            "
            >
              Teaching Approach— {approaching}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-[15px] md:pl-[37px]">
        <span className="text-[26px] md:text-[36px] text-light-100">
          {price} euro
        </span>
        <span className="text-[15px] md:text-[20px] text-dark-400">1 hour</span>
        <Rating rating={5} />
        <Button variant="secondary">Book</Button>
        <span className="text-[14px] text-dark-400">First lesson - free</span>
      </div>
    </div>
  );
};
