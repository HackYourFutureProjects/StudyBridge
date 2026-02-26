import ReviewsIcon from "../../icons/Reviews";
import { Rating } from "../../rating/Rating";
import UsersIcon from "../../icons/UsersIcon";
import { ReviewType } from "../../../api/review/review.type";

interface ReviewCardProps {
  reviewData: ReviewType;
}

export const ReviewCardTeacher = ({
  reviewData: {
    studentName,
    studentAvatar,
    rating,
    subject,
    review,
    createdAt,
  },
}: ReviewCardProps) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col bg-[#15141D] p-[16px] md:p-[25px] rounded-2xl h-full">
        {/* Header Part (Avatar , Name, Icon ) */}
        <div className="flex items-center gap-[10px] md:gap-[16px] mb-[12px] md:mb-[20px]">
          {studentAvatar ? (
            <img
              src={studentAvatar}
              alt={studentName}
              className="flex-shrink-0 rounded-full w-[28px] md:w-[40px] h-[28px] md:h-[40px] object-cover"
            />
          ) : (
            <UsersIcon className="flex-shrink-0 w-[28px] md:w-[40px] h-[28px] md:h-[40px] text-[#E4E4E4]" />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-xs md:text-base truncate">
              {studentName}
            </h4>
            <p className="text-[10px] text-white/60 md:text-sm truncate">
              {subject}
            </p>
          </div>

          <ReviewsIcon className="opacity-20 w-3.5 md:w-auto h-3.5 md:h-auto shrink-0" />
        </div>

        {/* Rieview Section */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <Rating rating={rating} />
            {createdAt && (
              <span className="text-[10px] text-white/40 md:text-xs">
                {new Date(createdAt).toLocaleDateString("en-GB")}
              </span>
            )}
          </div>

          {review && (
            <p className="text-white/80 text-xs md:text-base wrap-break-word">
              {review}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
