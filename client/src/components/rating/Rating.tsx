import Star from "../../components/icons/Star";
import StarWhite from "../../components/icons/StarWhite";
import StarHalf from "../../components/icons/StarHalf";

type RatingType = {
  rating: number;
};

// what does thuis file do?
// This component takes a rating value (between 0 and 5) as a prop and renders a visual representation of that rating using star icons.
// It displays filled stars for the rating value and empty stars for the remaining out of 5. For example, if the rating is 3, it will show 3 filled stars and 2 empty stars.
//

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
        }
        return <StarWhite key={value} />;
      })}
    </div>
  );
};
