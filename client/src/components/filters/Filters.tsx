import { RadioGroup } from "../ui/radioGroup/RadioGroup";
import type { Option } from "../ui/select/select";
import { useState } from "react";
import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { Checkbox } from "../ui/checkbox/Checkbox";
import { SliderRange } from "../ui/sliderRange/SliderRange";

const radioOptions: Option[] = [
  { label: "English", value: "English" },
  { label: "German", value: "German" },
  { label: "Russian", value: "Russian" },
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
];

export const Filters = () => {
  const [value, setValue] = useState([0, 500]);
  const [selectedRatings, setSelectedRatings] = useState<Set<number>>(
    () => new Set(),
  );
  // const ratings = Array.from(selectedRatings);
  const toggleRating = (rating: number, next: boolean) => {
    setSelectedRatings((prev) => {
      const copy = new Set(prev);
      if (next) {
        copy.add(rating);
      } else {
        copy.delete(rating);
      }
      return copy;
    });
  };

  const handleSliderCommitted = (value: number[]) => {
    setValue(value);
  };

  return (
    <div className="bg-purple-600 w-72.5 sm:w-full lg:w-78 p-5 rounded-[30px]">
      <h4 className="text-light-100 text-[18px] mb-5">Filters</h4>
      <div
        className="
                    flex flex-col items-start py-5 mr-7.5 mb-5
                    border-light-100 border-b border-t
                    "
      >
        <h5 className="text-light-100 mb-5">Tutors</h5>
        <RadioGroup options={radioOptions} />
      </div>
      <div className="flex flex-col items-start gap-5 mb-6">
        <h4 className="text-light-100 text-[12px]">FILTER BY PRICE</h4>
        <SliderRange
          min={0}
          max={500}
          value={value}
          onValueChange={setValue}
          onValueCommit={handleSliderCommitted}
        />
        <Button variant="secondary">Apply</Button>
      </div>
      <div className="mb-5">
        <h4 className="text-light-100 text-[12px] mb-5 py-[20] b">
          FILTER BY REVIEWS
        </h4>
        <div className="flex flex-col items-start gap-4 py-5 border-light-100 border-b border-t">
          {[5, 4, 3, 2, 1].map((rating) => (
            <Checkbox
              key={rating}
              checked={selectedRatings.has(rating)}
              onValueChange={(next) => toggleRating(rating, next)}
              label={<Rating rating={rating} />}
            />
          ))}
        </div>
      </div>
      <Button variant="secondary">Clear filters</Button>
    </div>
  );
};
