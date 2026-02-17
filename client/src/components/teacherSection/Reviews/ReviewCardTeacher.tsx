import ReviewsIcon from "../../icons/Reviews";
import { Rating } from "../../rating/Rating";

//TODO : change the props schema to match the real data structure of reviews when we have it from the backend.
//
interface ReviewCardProps {
  name: string;
  avatar?: string;
  rating: number;
  course: string;
  review: string;
  createdAt?: string;
}

export const ReviewCardTeacher = ({
  name,
  avatar,
  rating,
  course,
  review,
  createdAt,
}: ReviewCardProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col bg-[#15141D] p-[16px] md:p-[25px] rounded-2xl h-auto">
        {/* Header Part (Avatar , Name, Icon ) */}
        <div className="flex items-center gap-[10px] md:gap-[16px] mb-[12px] md:mb-[20px]">
          <img
            src={avatar || "/default-avatar.png"}
            alt={name}
            className="flex-shrink-0 rounded-full w-[28px] md:w-[40px] h-[28px] md:h-[40px] object-cover"
          />

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-xs md:text-base truncate">
              {name}
            </h4>
            <p className="text-[10px] text-white/60 md:text-sm truncate">
              {course}
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
                {new Date(createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {review && (
            <p className="text-white/80 text-xs md:text-base leading-relaxed">
              {review}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
