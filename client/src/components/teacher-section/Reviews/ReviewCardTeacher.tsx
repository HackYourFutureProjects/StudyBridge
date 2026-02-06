import reviewsIcon from "../../../assets/icons/reviews.svg";

interface ReviewCardProps {
  avatar: string;
  name: string;
  course: string;
  review: string;
}

export const ReviewCardTeacher = ({
  avatar,
  name,
  course,
  review,
}: ReviewCardProps) => {
  return (
    <div className="w-full">
      <div className="bg-[#15141D] rounded-2xl p-[20px] sm:p-[16px] md:p-[18px] lg:p-[25px] flex flex-col h-auto">
        <div className="flex items-center gap-[12px] sm:gap-[10px] md:gap-[11px] lg:gap-[16px] mb-[16px] sm:mb-[12px] md:mb-[14px] lg:mb-[20px] flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-[32px] h-[32px] sm:w-[28px] sm:h-[28px] md:w-[30px] md:h-[30px] lg:w-[40px] lg:h-[40px] rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm sm:text-xs md:text-xs lg:text-base">
              {name}
            </h4>
            <p className="text-white/60 text-xs sm:text-xs md:text-xs lg:text-sm truncate">
              {course}
            </p>
          </div>

          <img
            src={reviewsIcon}
            alt=""
            className="w-auto h-auto opacity-20 flex-shrink-0 w-[16px] h-[16px] sm:w-[14px] sm:h-[14px] md:w-[15px] md:h-[15px] lg:w-auto lg:h-auto"
          />
        </div>

        <p className="text-white/80 text-sm sm:text-xs md:text-xs lg:text-base leading-relaxed">
          {review}
        </p>
      </div>
    </div>
  );
};
