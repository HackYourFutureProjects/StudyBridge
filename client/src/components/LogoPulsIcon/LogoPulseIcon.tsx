import LogoIcon from "../icons/LogoIcon";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type Size = "lg" | "sm";

const wrapper = cva("flex items-center justify-center mt-5", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: { fullWidth: true },
});

const logoPulseVariants = cva("relative", {
  variants: {
    size: {
      lg: "w-40 h-40",
      sm: "w-20 h-20",
    },
  },
  defaultVariants: { size: "lg" },
});

const innerCircleVariants = cva(
  "absolute rounded-full bg-[#15141D] flex items-center justify-center",
  {
    variants: {
      size: {
        lg: "inset-2.5",
        sm: "inset-[5px]",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

const iconSizeMap: Record<Size, { w: number; h: number }> = {
  lg: { w: 90, h: 90 },
  sm: { w: 45, h: 45 },
};

type Props = Omit<VariantProps<typeof logoPulseVariants>, "size"> & {
  size?: Size;
  className?: string;

  fullWidth?: boolean;
  wrapperClassName?: string;
};

export const LogoPulseIcon = ({
  size = "lg",
  className,
  fullWidth = true,
  wrapperClassName,
}: Props) => {
  const { w, h } = iconSizeMap[size];

  return (
    <div className={twMerge(wrapper({ fullWidth }), wrapperClassName)}>
      <div className={twMerge(logoPulseVariants({ size }), className)}>
        <div className="loader-ring" />
        <div className={innerCircleVariants({ size })}>
          <div className="loader-pulse text-purple-500">
            <LogoIcon width={String(w)} height={String(h)} />
          </div>
        </div>
      </div>
    </div>
  );
};
