import { RadioGroup } from "../ui/radioGroup/RadioGroup";
import type { Option } from "../ui/select/Select.tsx";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { Checkbox } from "../ui/checkbox/Checkbox";
import { SliderRange } from "../ui/sliderRange/SliderRange";
import { useTeachersFiltersStore } from "../../store/filters.store.ts";
import { useShallow } from "zustand/react/shallow";

const radioOptions: Option[] = [
  { label: "English", value: "English" },
  { label: "German", value: "German" },
  { label: "Russian", value: "Russian" },
  { label: "French", value: "French" },
  { label: "Spanish", value: "Spanish" },
];

export const Filters = () => {
  const {
    subject,
    minPrice,
    maxPrice,
    ratings,
    setSubject,
    setPrice,
    setRatings,
    clear,
  } = useTeachersFiltersStore(
    useShallow((s) => ({
      subject: s.subject,
      minPrice: s.minPrice,
      maxPrice: s.maxPrice,
      ratings: s.ratings,
      setSubject: s.setSubject,
      setPrice: s.setPrice,
      setRatings: s.setRatings,
      clear: s.clear,
    })),
  );

  const [priceDraft, setPriceDraft] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPriceDraft([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const selectedRatings = useMemo(() => new Set(ratings), [ratings]);

  const toggleRating = (rating: number, next: boolean) => {
    const copy = new Set(ratings);

    if (next) {
      copy.add(rating);
    } else {
      copy.delete(rating);
    }
    setRatings(Array.from(copy).sort((a, b) => b - a));
  };

  const applyPrice = () => setPrice(priceDraft[0], priceDraft[1]);

  const clearAll = () => {
    clear();
    setPriceDraft([0, 500]);
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
        <RadioGroup
          options={radioOptions}
          value={subject ?? ""}
          onValueChange={(v: string) => setSubject(v || undefined)}
        />
      </div>
      <div className="flex flex-col items-start gap-5 mb-6">
        <h4 className="text-light-100 text-[12px]">FILTER BY PRICE</h4>
        <SliderRange
          min={0}
          max={500}
          value={priceDraft}
          onValueChange={(v) => setPriceDraft([v[0], v[1]])}
        />
      </div>
      <div className="mb-5">
        <h4 className="text-light-100 text-[12px] mb-5 py-[20] b">
          FILTER BY REVIEWS
        </h4>
        <div className="flex flex-col items-start gap-4 py-5 border-light-100 border-b border-t">
          {[5, 4, 3, 2, 1].map((r) => (
            <Checkbox
              key={r}
              checked={selectedRatings.has(r)}
              onValueChange={(next) => toggleRating(r, next)}
              label={<Rating rating={r} />}
            />
          ))}
        </div>
      </div>
      <Button variant="secondary" onClick={applyPrice}>
        Apply
      </Button>
      <Button variant="secondary" onClick={clearAll}>
        Clear filters
      </Button>
    </div>
  );
};
