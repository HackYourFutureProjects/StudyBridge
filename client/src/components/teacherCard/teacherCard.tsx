import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { TeacherStatus, TeacherType } from "../../api/teacher/teacher.type";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../../api/upload/upload.api";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useAuthSessionStore } from "../../store/authSession.store.ts";
import { StatusChange } from "../statusChanger/StatusChange.tsx";

type TeacherCardType = {
  teacher: TeacherType;
  showBookButton?: boolean;
  changeStatus?: (id: string, status: TeacherStatus) => void;
  isStatusPending?: boolean;
};

const teacherCardVariants = cva(
  "flex flex-col border bg-[#15141D80] px-4 sm:px-6 md:px-9 py-6 md:py-9 rounded-[25px]",
  {
    variants: {
      status: {
        active: "border-blue-500",
        rejected: "border-danger",
        blocked: "border-light-600",
        draft: "border-yellow-400",
        pending: "border-purple-400",
      },
    },
    defaultVariants: { status: "active" },
  },
);

export type TeacherCardVariantsProps = VariantProps<typeof teacherCardVariants>;
const teacherCardClassName = (
  props: TeacherCardVariantsProps,
  className?: string,
) => twMerge(teacherCardVariants(props), className);

export const TeacherCard = ({
  teacher,
  changeStatus,
  showBookButton = true,
  isStatusPending,
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
    status,
  } = teacher;

  const navigate = useNavigate();
  const user = useAuthSessionStore((state) => state.user);
  const avatarUrl = getAvatarUrl(profileImageUrl || null);
  const pulseClass = isStatusPending ? `pulse-border--${status}` : "";
  const handleBookClick = () => {
    if (user?.role === "moderator") {
      navigate(`/moderator/teachers/${id}`);
      return;
    }
    navigate(`/teacher/${id}`);
  };

  const onChangeStatus = (id: string, status: TeacherStatus) => {
    changeStatus?.(id, status);
  };

  return (
    <div
      className={teacherCardClassName(
        { status },
        twMerge("flex flex-col gap-4", pulseClass),
      )}
    >
      {Boolean(changeStatus) && (
        <StatusChange changeStatus={onChangeStatus} id={id} status={status} />
      )}
      <div className="flex flex-col items-center sm:flex-row">
        <div
          className="flex-1 min-w-0 flex flex-col items-center sm:items-start xl:flex-row gap-3.75
                   xl:pr-5.75"
        >
          <div className="flex items-center flex-col gap-3.75">
            <div
              className="block
                md:block lg:hidden xl:block
                w-28 h-28
                md:w-37.5 md:h-37.5
                lg:w-43.25 lg:h-43.25
                xl:w-48 xl:h-48
                overflow-hidden rounded-[25px]

                             "
            >
              {avatarUrl ? (
                <img
                  className="w-full h-full object-cover "
                  src={avatarUrl}
                  alt="person"
                />
              ) : (
                <DefaultAvatarIcon className="w-full h-full" />
              )}
            </div>
            <div className="pb-2.25 border-b border-light-200">
              <p className="text-light-100 text-[16px] md:text-[24px] lg:text-[24px] xl:text-[24px]">
                {firstName} {lastName}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start xl:items-center gap-5">
            {subjects.length > 0 && (
              <div className="flex flex-col gap-2 justify-start xl:justify-start xl:flex-wrap xl:flex-row">
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
        <div className="w-px self-stretch bg-[#ffffff10]" />
        <div className="w-50 flex flex-col items-center justify-center gap-3.75 md:pl-9.25">
          <span className="text-[22px] md:text-[30px] lg:text-[34px] xl:text-[36px] text-light-100">
            {priceFrom} euro
          </span>
          <span className="text-[13px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-dark-400">
            1 hour
          </span>
          <Rating rating={rating} />
          {showBookButton && (
            <Button onClick={handleBookClick} variant="secondary">
              {user?.role === "moderator" ? "Details" : "Book"}
            </Button>
          )}
          <span className="text-[14px] text-dark-400">First lesson - free</span>
        </div>
      </div>
    </div>
  );
};
