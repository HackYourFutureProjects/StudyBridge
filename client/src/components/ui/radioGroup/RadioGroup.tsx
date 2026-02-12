import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
const RadioGroupRoot = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={`flex flex-col gap-3 ${className ?? ""}`}
      {...props}
      ref={ref}
    />
  );
});

RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={[
        "peer relative h-5 w-5 shrink-0 rounded-full  cursor-pointer",
        "border-2 border-light-100",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
        "data-[state=checked]:border-pink-600 data-[state=checked]:bg-pink-600",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={[
          "absolute left-1/2 top-1/2",
          "-translate-x-1/2 -translate-y-1/2",
          "h-2.5 w-2.5 rounded-full bg-light-100",
        ].join(" ")}
      />
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

type Option = {
  label: string;
  value: string;
};

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "children"
> & {
  errorMessage?: string;
  options: Option[];
};
const RadioGroup = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>((props, ref) => {
  const { options, className, ...restProps } = props;

  return (
    <RadioGroupRoot className={className} {...restProps} ref={ref}>
      {options.map((option) => (
        <div className="flex items-center gap-3" key={option.value}>
          <RadioGroupItem id={option.value} value={option.value} />
          <label
            htmlFor={option.value}
            className="
                            text-white
                            peer-data-[state=checked]:text-pink-600
                            cursor-pointer
                            select-none
                        "
          >
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroupRoot>
  );
});
RadioGroup.displayName = "RadioGroup";
export { RadioGroup, RadioGroupItem, RadioGroupRoot };
