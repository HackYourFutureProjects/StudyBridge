import Star from "../../components/icons/Star";
import StarWhite from "../../components/icons/StarWhite";
import StarHalf from "../../components/icons/StarHalf";

type RatingType = {
  rating: number;
};

export const Rating = ({ rating }: RatingType) => {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        if (value <= rating) {
          return <Star key={value} />;
        }
        if (value - 0.5 === rating) {
          return <StarHalf key={value} />;
        } else {
          return <StarWhite key={value} />;
        }
      })}
    </div>
  );
};
