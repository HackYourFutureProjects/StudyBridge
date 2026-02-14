import { RadioGroup } from "../ui/radioGroup/RadioGroup";
import { useMemo } from "react";
import { Button } from "../ui/button/Button";
import { Rating } from "../rating/Rating";
import { Checkbox } from "../ui/checkbox/Checkbox";
import { SliderRange } from "../ui/sliderRange/SliderRange";
import { useTeachersFiltersStore } from "../../store/filters.store.ts";
import { useShallow } from "zustand/react/shallow";
import { Subjects } from "../../constants/subjects.ts";

export const Filters = () => {
  const {
    subjectDraft,
    minPriceDraft,
    maxPriceDraft,
    ratingsDraft,
    setSubjectDraft,
    setPriceDraft,
    setRatingsDraft,
    applyDraft,
    clear,
  } = useTeachersFiltersStore(
    useShallow((s) => ({
      subjectDraft: s.subjectDraft,
      minPriceDraft: s.minPriceDraft,
      maxPriceDraft: s.maxPriceDraft,
      ratingsDraft: s.ratingsDraft,
      setSubjectDraft: s.setSubjectDraft,
      setPriceDraft: s.setPriceDraft,
      setRatingsDraft: s.setRatingsDraft,
      applyDraft: s.applyDraft,
      clear: s.clear,
    })),
  );

  const selectedRatings = useMemo(() => new Set(ratingsDraft), [ratingsDraft]);

  const toggleRating = (rating: number, next: boolean) => {
    const copy = new Set(ratingsDraft);
    if (next) {
      copy.add(rating);
    } else {
      copy.delete(rating);
    }

    setRatingsDraft(Array.from(copy).sort((a, b) => b - a));
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
          options={Subjects}
          value={subjectDraft ?? ""}
          onValueChange={(v: string) => setSubjectDraft(v || undefined)}
        />
      </div>
      <div className="flex flex-col items-start gap-5 mb-6">
        <h4 className="text-light-100 text-[12px]">FILTER BY PRICE</h4>
        <SliderRange
          min={0}
          max={500}
          value={[minPriceDraft, maxPriceDraft]}
          onValueChange={(v) => setPriceDraft(v[0], v[1])}
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
      <div className="flex flex-col items-start gap-5 mb-6">
        <Button variant="secondary" onClick={applyDraft}>
          Apply
        </Button>
        <Button variant="secondary" onClick={clear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
};
