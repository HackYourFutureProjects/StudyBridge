import * as Select from "@radix-ui/react-select";
import * as React from "react";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import ArrowDown from "../../icons/ArrowDown";

export type Option<TValue extends string = string> = {
  label: string;
  value: TValue;
};
type SelectContentProps = React.ComponentPropsWithoutRef<typeof Select.Content>;
type OnCloseAutoFocusEvent = Parameters<
  NonNullable<SelectContentProps["onCloseAutoFocus"]>
>[0];

const SelectItem = forwardRef<
  ComponentRef<typeof Select.Item>,
  ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className="
                px-4 py-2
                rounded-md
                cursor-pointer
                outline-none
                select-none
                hover:bg-pink-600
      "
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="SelectItemIndicator"></Select.ItemIndicator>
    </Select.Item>
  );
});
SelectItem.displayName = "SelectItem";
export type SelectComponentType<TValue extends string = string> = Omit<
  React.ComponentPropsWithoutRef<typeof Select.Root>,
  "children" | "value" | "defaultValue" | "onValueChange"
> & {
  onChange: (item: TValue) => void;
  value?: TValue;
  defaultValue?: TValue;
  options: readonly Option<TValue>[];
  errorMessage?: string;
  className?: string;
  placeholder?: string;
};

export const SelectComponent = <TValue extends string = string>({
  onChange,
  value,
  defaultValue,
  options,
  placeholder,
  ...props
}: SelectComponentType<TValue>) => {
  const pointerRef = React.useRef(false);
  const currentValue = value || defaultValue || "";
  const selectedOption = options.find((opt) => opt.value === currentValue);

  return (
    <Select.Root
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(value) => onChange(value as TValue)}
    >
      <Select.Trigger
        onPointerDown={() => (pointerRef.current = true)}
        onKeyDown={() => (pointerRef.current = false)}
        className="
                      group
                      w-[60%] sm:w-100
                      h-9 sm:h-13
                      px-4 sm:px-6 lg:px-10
                      py-1.5 sm:py-2
                      gap-1.5 sm:gap-2.5
                      rounded-[60px]
                      border border-[#FFFFFF26]
                      flex items-center justify-center
                      cursor-pointer
                      bg-light-100 text-dark-900
                      text-xs sm:text-sm lg:text-base
                      transition
                      hover:border-purple-500
                      outline-none
                      focus:outline-none focus:ring-0
                      focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
                "
      >
        <Select.Value placeholder={placeholder}>
          {selectedOption?.label || currentValue || placeholder}
        </Select.Value>
        <Select.Icon
          className="
                      transition-transform duration-200
                      group-data-[state=open]:rotate-180
                    "
        >
          <ArrowDown className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          side="bottom"
          align="start"
          sideOffset={20}
          position="popper"
          avoidCollisions={false}
          className="
                        z-50
                        w-[var(--radix-select-trigger-width)]
                        max-h-[300px]
                        rounded-[10px]
                        shadow-lg
                        overflow-hidden
                        bg-purple-800 text-light-100
                      "
          onCloseAutoFocus={(e: OnCloseAutoFocusEvent) => {
            if (pointerRef.current) {
              e.preventDefault();
              pointerRef.current = false;
            }
          }}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-purple-800 text-light-100 cursor-default">
            Up
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1 max-h-[280px] overflow-y-auto">
            <Select.Group>
              {options.map((item) => {
                return (
                  <SelectItem key={item.label} value={item.value}>
                    <div>{item.label}</div>
                  </SelectItem>
                );
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-purple-800 text-light-100 cursor-default">
            Down
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
