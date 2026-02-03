import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  [
    "font-inherit text-inherit",
    "inline-flex items-center justify-center gap-1",
    "min-h-10 min-w-10 px-[55px] py-3.5",
    "rounded-full text-sm font-medium text-center",
    "border-0 cursor-pointer select-none outline-none",
    "focus-visible:ring-1 focus-visible:ring-offset-1",
    "transition ease-in-out duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-purple-700 text-white hover:bg-purple-700",
        secondary:
          "bg-dark-900 text-white border-2 border-blue-500 hover:bg-dark-700",
        success: "bg-success-500 text-white hover:brightness-95",
        info: "bg-blue-500 text-white hover:brightness-95",
        tertiary:
          "bg-dark-700 border border-dark-500 text-white hover:brightness-95",
        link: "bg-transparent text-light-100",
      },
      size: {
        default: "min-h-10 px-[55px] py-3.5",
        auth: "min-h-12 px-[70px] py-[21px]",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", fullWidth: false },
  },
);

type OwnProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof buttonStyles>;

type PolymorphicProps<T extends ElementType> = {
  as?: T;
} & OwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | "as">;

export const Button = <T extends ElementType = "button">(
  props: PolymorphicProps<T>,
) => {
  const { as, children, className, variant, fullWidth, size, ...rest } = props;
  const Component = (as ?? "button") as ElementType;

  return (
    <Component
      className={twMerge(buttonStyles({ variant, fullWidth, size }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};
