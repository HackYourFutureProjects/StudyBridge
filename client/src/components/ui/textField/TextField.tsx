import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  MemoExoticComponent,
  RefAttributes,
  SVGProps,
} from "react";
import React, {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import ClosedEye from "../../icons/ClosedEye";
import Eye from "../../icons/Eye";
export type TextFieldProps = {
  onValueChange?: (value: string) => void;
  errorMessage?: string;
  label?: string;
  variant?: "primary" | "secondary";
  iconClassName?: string;
  containerClassName?: string;
  Icon?: MemoExoticComponent<
    ForwardRefExoticComponent<
      Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
    >
  >;
} & ComponentPropsWithoutRef<"input">;

const rootStyles = cva(
  "w-full hover:cursor-text flex flex-col items-center lg:items-start",
  {
    variants: {
      state: {
        default: "flex flex-col gap-[7px]",
        error: "text-danger",
      },
    },
    defaultVariants: { state: "default" },
  },
);

const fieldContainerStyles = cva(
  [
    "relative",
    "grid grid-cols-[1fr_auto] items-center",
    "transition",
    "border",
    "focus-within:outline focus-within:outline-1",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-dark-800 border-dark-600",
        secondary: "bg-light-100 border-light-200",
      },

      layout: {
        primary:
          "w-full max-w-[498px] gap-[10px] px-[24px] rounded-[88px] h-[75px]",
        secondary: "max-w-[320px] gap-[8px] px-[14px] py-[14px] rounded-[14px]",
      },

      state: {
        default:
          "hover:border-purple-500 focus-within:border-outline-focus focus-within:outline-purple-500",
        error:
          "border-danger hover:!border-danger focus-within:!border-danger focus-within:outline-danger",
      },
    },
    defaultVariants: {
      variant: "primary",
      layout: "primary",
      state: "default",
    },
  },
);

const inputStyles = cva(
  [
    "w-full bg-transparent outline-none border-0",
    "font-inherit text-[14px]",
    "min-w-0",
    "placeholder:text-[14px]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "text-light-100 placeholder:text-dark-400",
        secondary: "text-light-500 placeholder:text-light-500",
      },
      state: {
        default: "",
        error: "text-danger placeholder:text-danger",
      },
    },
    defaultVariants: { variant: "primary", state: "default" },
  },
);

const labelStyles = cva("mb-0.5 text-[12px]", {
  variants: {
    variant: {
      primary: "text-purple-500",
      secondary: "text-light-500",
    },
  },
  defaultVariants: { variant: "primary" },
});

const iconStyles = "mr-2 transition";
const showPasswordBtnStyles = cva(
  [
    "absolute top-1/2 right-[1%] -translate-y-1/2",
    "w-5 h-5 mr-[25px] p-0",
    "bg-transparent border-0 outline-none cursor-pointer",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline-focus",
    "inline-flex items-center justify-center",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "text-dark-400",
        secondary: "text-light-500",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      errorMessage,
      Icon,
      placeholder,
      type,
      label,
      onChange,
      onValueChange,
      iconClassName,
      containerClassName,
      variant = "primary",
      ...restProps
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const id = useId();
    const finalType = getFinalType(type, showPassword);

    const state: VariantProps<typeof rootStyles>["state"] = errorMessage
      ? "error"
      : "default";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <>
        <div
          className={twMerge(rootStyles({ state }), containerClassName)}
          onClick={() => inputRef.current?.focus()}
        >
          {label && (
            <label htmlFor={id} className={labelStyles({ variant })}>
              {label}
            </label>
          )}
          <div
            className={fieldContainerStyles({
              variant,
              layout: variant,
              state,
            })}
          >
            <div className="flex flex-col w-full gap-0.5">
              <input
                id={id}
                ref={inputRef}
                className={twMerge(
                  variant === "primary"
                    ? "tf-autofill-dark"
                    : "tf-autofill-light",
                  inputStyles({ variant, state }),
                  className,
                )}
                placeholder={placeholder}
                type={finalType}
                onChange={handleChange}
                autoComplete={isPassword ? "off" : undefined}
                {...restProps}
              />
            </div>

            {Icon && <Icon className={twMerge(iconStyles, iconClassName)} />}

            {isPassword && (
              <button
                className={showPasswordBtnStyles({ variant })}
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <ClosedEye /> : <Eye />}
              </button>
            )}
          </div>
          {errorMessage && (
            <span className="mt-1 text-sm text-danger">{errorMessage}</span>
          )}
        </div>
      </>
    );
  },
);

TextField.displayName = "TextField";

function getFinalType(
  type: ComponentProps<"input">["type"],
  showPassword: boolean,
) {
  if (type === "password" && showPassword) {
    return "text";
  }
  return type;
}
