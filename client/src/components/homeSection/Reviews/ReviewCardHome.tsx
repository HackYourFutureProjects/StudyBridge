import ReviewsIcon from "../../icons/Reviews";

interface ReviewCardProps {
  avatar: string;
  name: string;
  course: string;
  review: string;
}

export const ReviewCardHome = ({
  avatar,
  name,
  course,
  review,
}: ReviewCardProps) => {
  return (
    <div className="w-full max-w-[343px] mx-auto">
      <div className="bg-[#15141D] rounded-2xl p-[25px] flex flex-col h-[220px]">
        <div className="flex items-center gap-[16px] mb-[20px] flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-base">{name}</h4>
            <p className="text-white/60 text-sm truncate">{course}</p>
          </div>

          <ReviewsIcon className="w-auto h-auto opacity-20 flex-shrink-0" />
        </div>

        <p className="text-white/80 text-base leading-relaxed flex-1 overflow-hidden">
          {review}
        </p>
      </div>
    </div>
  );
};
