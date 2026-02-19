import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { TeacherType } from "../../api/teacher/teacher.type";
import ImageNotFount from "../../assets/images/image-not-found.png";
import { useNavigate } from "react-router-dom";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useModalStore } from "../../store/modals.store";
import { MouseEvent } from "react";
type TeacherCardType = {
  teacher: TeacherType;
};

export const TeacherCard = ({ teacher }: TeacherCardType) => {
  const {
    id,
    firstName,
    lastName,
    subjects,
    profileImageUrl,
    experience,
    education,
    priceFrom,
    bio,
    rating,
  } = teacher;

  const navigate = useNavigate();
  const user = useAuthSessionStore((state) => state.user);
  const { open: openModal } = useModalStore();

  const handleBookClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      openModal("signIn");
      return;
    }

    navigate(`/teacher/${id}`);
  };
  return (
    <div
      className="flex flex-col items-center xl:flex-row border bg-[#15141D80] border-blue-500
                px-4 sm:px-6 md:px-9 py-6 md:py-9 rounded-[25px]"
    >
      <div
        className="flex-1 min-w-0 flex flex-col xl:flex-row gap-3.75
                  xl:border-r border-[#ffffff10] xl:pr-5.75"
      >
        <div className="flex items-center flex-col gap-3.75">
          <div
            className=" w-28 h-28
                md:w-37.5 md:h-37.5
                lg:w-43.25 lg:h-43.25
                xl:w-48 xl:h-48
                overflow-hidden rounded-[25px]

                             "
          >
            <img
              className="w-full h-full object-cover"
              src={profileImageUrl ?? ImageNotFount}
              alt="person"
            />
          </div>
          <div className="pb-2.25 border-b border-light-200">
            <p className="text-light-100 text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]">
              {firstName} {lastName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5">
          {subjects.length ? (
            <span
              className="inline-flex w-fit
                        shrink-0 border border-light-300 text-[12px] md:text-[12px] text-light-100 rounded-full bg-dark-900
                        px-8.75 py-0.5"
            >
              {subjects.map((subject) => (
                <span key={subject.subjectName}>
                  {subject.subjectName} teacher
                </span>
              ))}
            </span>
          ) : null}
          <div className="flex flex-col gap-5 w-full max-w-116.25">
            <p className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] text-light-100">
              Experience — {experience}
            </p>
            <p className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] text-light-100">
              Education —{" "}
              {education.map((item) => (
                <span key={item.degree}>{item.institution}</span>
              ))}
            </p>
            <p
              className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] text-light-100
                                overflow-hidden
                                [display:-webkit-box]
                                [-webkit-box-orient:vertical]
                                [-webkit-line-clamp:3]
                            "
            >
              {bio}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-50 flex flex-col items-center justify-center gap-3.75 md:pl-9.25">
        <span className="text-[22px] md:text-[30px] lg:text-[34px] xl:text-[36px] text-light-100">
          {priceFrom} euro
        </span>
        <span className="text-[13px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-dark-400">
          1 hour
        </span>
        <Rating rating={rating} />
        <Button onClick={handleBookClick} variant="secondary">
          Book
        </Button>
        <span className="text-[14px] text-dark-400">First lesson - free</span>
      </div>
    </div>
  );
};
