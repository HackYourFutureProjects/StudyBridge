import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import type { TeacherType as TeacherDetailType } from "../../types/teacher.types";
import type { TeacherType as TeacherApiType } from "../../api/teacher/teacher.type";
import ImageNotFount from "../../assets/images/image-not-found.png";

type TeacherCardType = {
  teacher: TeacherDetailType | TeacherApiType;
};

function isApiTeacher(
  t: TeacherDetailType | TeacherApiType,
): t is TeacherApiType {
  return "firstName" in t && "lastName" in t;
}

export const TeacherCard = ({ teacher }: TeacherCardType) => {
  const name = isApiTeacher(teacher)
    ? `${teacher.firstName} ${teacher.lastName}`
    : teacher.name;
  const image = isApiTeacher(teacher) ? teacher.profileImageUrl : teacher.image;
  const subjectLabel = isApiTeacher(teacher)
    ? teacher.subjects.map((s) => s.subjectName).join(", ")
    : teacher.subject;
  const experience = isApiTeacher(teacher)
    ? String(teacher.experience)
    : teacher.experience;
  const education = isApiTeacher(teacher)
    ? teacher.education.map((e) => e.institution).join(", ")
    : teacher.education;
  const price = isApiTeacher(teacher) ? teacher.priceFrom : teacher.price;
  const bio = isApiTeacher(teacher) ? (teacher.bio ?? "") : teacher.approaching;

  return (
    <div className="flex flex-col md:flex-row border bg-[#15141D80] border-blue-500 px-9 py-9 rounded-[25px]">
      <div className="flex flex-col md:flex-row gap-3.75 md:border-r border-[#ffffff10] md:pr-5.75">
        <div className="flex flex-col gap-3.75">
          <div
            className="md:block md:w-37.5 md:h-37.5 lg:w-43.25 lg:h-43.25 overflow-hidden rounded-[25px]

                             "
          >
            <img
              className="w-full h-full object-cover"
              src={image ?? ImageNotFount}
              alt="person"
            />
          </div>
          <div className="pb-2.25 border-b border-light-200">
            <p className="text-light-100 text-[18px]">{name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <span
            className="inline-flex w-fit
                        shrink-0 border border-light-300 text-[12px] md:text-[12px] text-light-100 rounded-full bg-dark-900
                        px-8.75 py-0.5"
          >
            {subjectLabel} teacher
          </span>
          <div className="flex flex-col gap-5 w-full max-w-116.25">
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
              Teaching Approach— {bio}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3.75 md:pl-9.25">
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
