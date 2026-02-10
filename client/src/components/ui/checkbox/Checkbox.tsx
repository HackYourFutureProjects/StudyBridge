import * as CheckboxRadix from "@radix-ui/react-checkbox";
import * as LabelRadix from "@radix-ui/react-label";
import Check from "../../icons/Check";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

export type CheckboxProps = {
  className?: string;
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: ReactNode;
  id?: string;
  position?: "left";
};

export const Checkbox = ({
  checked,
  onValueChange,
  disabled,
  required,
  label,
  id,
  className,
}: CheckboxProps) => {
  return (
    <div className={className}>
      <LabelRadix.Root asChild htmlFor={id}>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-light-100">
          <CheckboxRadix.Root
            className={twMerge(
              "shrink-0 cursor-pointer",
              "flex items-center justify-center",
              "w-5.5 h-5.5 rounded-md",
              "border border-[#F4F4F4] bg-white",
              "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
              "text-white",
              "outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            checked={checked}
            onCheckedChange={(v) => onValueChange?.(v === true)}
            disabled={disabled}
            required={required}
            id={id}
          >
            <CheckboxRadix.Indicator forceMount>
              <Check className="w-4 h-4 text-light-100" />
            </CheckboxRadix.Indicator>
          </CheckboxRadix.Root>
          {label}
        </label>
      </LabelRadix.Root>
    </div>
  );
};
