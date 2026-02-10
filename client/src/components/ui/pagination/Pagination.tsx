import { usePagination } from "./usePagination";
import { Button } from "../button/Button";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const paginationButtonStyles = cva(
  [
    "inline-flex items-center justify-center",
    "text-sm font-medium",
    "transition",
    "outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
    "disabled:cursor-not-allowed",
    "w-9 h-9 px-3",
  ].join(" "),
  {
    variants: {
      theme: {
        primary: "",
        secondary: "",
      },
      shape: {
        round: "rounded-full",
        square: "rounded-[8px]",
      },
      state: {
        inactive: "",
        active: "",
      },
    },
    compoundVariants: [
      {
        theme: "primary",
        state: "inactive",
        className: "bg-dark-300 text-dark-900 hover:bg-dark-600",
      },
      {
        theme: "primary",
        state: "active",
        className: "bg-blue-500 text-dark-900",
      },

      {
        theme: "secondary",
        state: "inactive",
        className: "bg-dark-900 text-light-100 hover:bg-dark-800",
      },
      {
        theme: "secondary",
        state: "active",
        className: "bg-light-100 text-dark-900",
      },
    ],
    defaultVariants: {
      theme: "primary",
      shape: "round",
      state: "inactive",
    },
  },
);

type PaginationProps = {
  activeIndex: number;
  onIndexChange: (page: number) => void;
  totalPages: number;
  siblings?: number;
  theme?: "primary" | "secondary";
  shape?: "round" | "square";
};

export const Pagination = ({
  activeIndex,
  onIndexChange,
  totalPages,
  siblings = 1,
  theme = "primary",
  shape = "round",
}: PaginationProps) => {
  const {
    paginationRange,
    isFirstPage,
    isLastPage,
    handleMainPageClicked,
    handleNextPageClicked,
    handlePreviousPageClicked,
  } = usePagination({
    count: totalPages,
    siblings,
    page: activeIndex,
    onChange: onIndexChange,
  });

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="link"
        className={paginationButtonStyles({ theme, shape, state: "inactive" })}
        onClick={handlePreviousPageClicked}
        disabled={isFirstPage}
      >
        Prev
      </Button>

      <div className="flex items-center justify-center gap-3">
        {paginationRange.map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={idx}
                className={twMerge(
                  paginationButtonStyles({ theme, shape, state: "inactive" }),
                  "bg-transparent hover:bg-transparent text-light-100",
                )}
              >
                ...
              </span>
            );
          }

          const isActive = page === activeIndex;

          return (
            <Button
              key={idx}
              variant="link"
              className={paginationButtonStyles({
                theme,
                shape,
                state: isActive ? "active" : "inactive",
              })}
              onClick={handleMainPageClicked(page)}
              disabled={isActive}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="link"
        className={paginationButtonStyles({ theme, shape, state: "inactive" })}
        onClick={handleNextPageClicked}
        disabled={isLastPage}
      >
        Next
      </Button>
    </div>
  );
};
