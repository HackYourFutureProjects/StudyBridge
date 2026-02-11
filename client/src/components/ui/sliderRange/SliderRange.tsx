import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

export const SliderRange = forwardRef<
  ComponentRef<typeof SliderPrimitive.Root>,
  Omit<ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, "value"> & {
    value: (undefined | number)[];
    label?: string;
  }
>(({ className, value, onValueChange, min, max, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-50 sm:max-w-68.75">
      <label className="flex items-center justify-between">
        <span className="text-sm text-light-100">{props.label}</span>
      </label>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-between w-full">
          <span className="flex justify-center text-sm text-black bg-light-100 px-2.5 py-1.25 rounded-full">
            ${value?.[0]}
          </span>
          <span className="flex justify-center text-sm text-black bg-light-100 px-2.5 py-1.25 rounded-full">
            ${value?.[1] ?? max}
          </span>
        </div>
        <SliderPrimitive.Root
          min={min}
          max={max}
          value={[value?.[0] ?? min ?? 0, value?.[1] ?? max ?? 0]}
          ref={ref}
          onValueChange={onValueChange}
          className={twMerge(
            "relative flex items-center select-none touch-none",
            "w-full h-5",
            className,
          )}
          {...props}
        >
          <SliderPrimitive.Track
            className="
                              relative
                              h-0.5 w-full
                              rounded-[100px]
                              bg-black
                            "
          >
            <SliderPrimitive.Range
              className="
                                absolute h-full
                                rounded-[100px]
                                bg-black
                              "
            />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb
            aria-label="Min"
            className="
                          block
                          cursor-pointer
                          w-2 h-2
                          rounded-full
                          border-2 border-black
                          bg-white
                          shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]
                          outline-none
                          focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
                        "
          />
          <SliderPrimitive.Thumb
            aria-label="Max"
            className="
                          block
                          w-2 h-2
                          rounded-full
                          cursor-pointer
                          border-2 border-black
                          bg-white
                          shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]
                          outline-none
                          focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
                        "
          />
        </SliderPrimitive.Root>
      </div>
    </div>
  );
});
SliderRange.displayName = "SliderRange";
