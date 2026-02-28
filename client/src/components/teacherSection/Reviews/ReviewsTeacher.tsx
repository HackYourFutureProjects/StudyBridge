import { ReviewCardTeacher } from "./ReviewCardTeacher";
import { Button } from "../../ui/button/Button";
import shapeImage from "../../../assets/images/Shape.png";
import { ReviewType } from "../../../api/review/review.type";

interface ReviewsTeacherProps {
  reviews: ReviewType[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const ReviewsTeacher = ({
  reviews,
  isLoading,
  onLoadMore,
  hasMore,
}: ReviewsTeacherProps) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 section-spacing">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container-centered">
        <div className="gap-x-8 gap-y-12 grid grid-cols-1 w-full">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="relative flex justify-center px-[15px] sm:px-[10px] md:px-[5px] w-full"
            >
              <div className="z-10 relative w-full">
                <ReviewCardTeacher reviewData={review} />
              </div>

              <img
                src={shapeImage}
                alt=""
                className="top-[8px] sm:top-[6px] md:top-[4px] lg:top-[10px] -right-[30px] sm:-right-[25px] md:-right-[20px] lg:-right-[50px] -bottom-[3px] sm:-bottom-[5px] md:-bottom-[7px] lg:-bottom-[5px] -left-[0px] sm:-left-[2px] md:-left-[5px] lg:-left-[0px] z-0 absolute rounded-2xl w-[calc(100%+30px)] sm:w-[calc(100%+27px)] md:w-[calc(100%+25px)] lg:w-[calc(100%+50px)] h-[calc(100%+11px)] sm:h-[calc(100%+11px)] md:h-[calc(100%+11px)] lg:h-[calc(100%+15px)] object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12 sm:mt-16 md:mt-20 lg:mt-12">
            <Button
              variant="secondary"
              onClick={onLoadMore}
              disabled={isLoading}
              className="mt-10"
            >
              {isLoading ? "Loading..." : "Load More Reviews"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
