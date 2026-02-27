import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { TeacherType } from "../../api/teacher/teacher.type";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../api/upload/upload.api";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";

type TeacherCardType = {
  teacher: TeacherType;
  showBookButton?: boolean;
};

export const TeacherCard = ({
  teacher,
  showBookButton = true,
}: TeacherCardType) => {
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

  const avatarUrl = getAvatarUrl(profileImageUrl || null);

  const handleBookClick = () => {
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
            {avatarUrl ? (
              <img
                className="w-full h-full object-cover"
                src={avatarUrl}
                alt="person"
              />
            ) : (
              <DefaultAvatarIcon className="w-full h-full" />
            )}
          </div>
          <div className="pb-2.25 border-b border-light-200">
            <p className="text-light-100 text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]">
              {firstName} {lastName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-5">
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {subjects.map((subject) => (
                <span
                  key={subject._id}
                  className="inline-flex shrink-0 border border-light-300 text-[12px] md:text-[12px] text-light-100 rounded-full bg-dark-900 px-8.75 py-0.5"
                >
                  {subject.subjectName} teacher
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-5 w-full max-w-116.25">
            <p className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] text-light-100">
              Experience — {experience} {experience === 1 ? "year" : "years"}
            </p>
            <p className="text-[12px] md:text-[14px] lg:text-[14px] xl:text-[15px] text-light-100">
              Education —{" "}
              {education.length > 0
                ? education.map((item, index) => (
                    <span key={item.degree}>
                      {item.institution}
                      {index < education.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "Not specified"}
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
        {showBookButton && (
          <Button onClick={handleBookClick} variant="secondary">
            Book
          </Button>
        )}
        <span className="text-[14px] text-dark-400">First lesson - free</span>
      </div>
    </div>
  );
};
