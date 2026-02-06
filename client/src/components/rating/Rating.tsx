import Star from "../../components/icons/Star";
import StarWhite from "../../components/icons/StarWhite";

type RatingType = {
  rating: number;
};

export const Rating = ({ rating }: RatingType) => {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        return value <= rating ? (
          <Star key={value} />
        ) : (
          <StarWhite key={value} />
        );
      })}
    </div>
  );
};
