import {
  type Ref,
  type SVGProps,
  forwardRef,
  memo,
  type MemoExoticComponent,
  type ForwardRefExoticComponent,
} from "react";

const CrossComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <g clipPath="url(#clip0_228_2683)">
      <path
        d="M24 1.414L22.586 0L12 10.586L1.414 0L0 1.414L10.586 12L0 22.586L1.414 24L12 13.414L22.586 24L24 22.586L13.414 12L24 1.414Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_228_2683">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Cross = memo(forwardRef(CrossComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default Cross;
