import {
  type Ref,
  type SVGProps,
  forwardRef,
  memo,
  type MemoExoticComponent,
  type ForwardRefExoticComponent,
} from "react";

const SvgComponent = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    ref={ref}
    viewBox="26 82 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M44.25 84.75H36.3103L33.75 82.1897C33.6112 82.0498 33.446 81.9389 33.264 81.8634C33.082 81.7879 32.8867 81.7494 32.6897 81.75H27.75C27.3522 81.75 26.9706 81.908 26.6893 82.1893C26.408 82.4707 26.25 82.8522 26.25 83.25V96.8081C26.2505 97.1904 26.4026 97.5568 26.6729 97.8271C26.9432 98.0974 27.3096 98.2495 27.6919 98.25H44.3334C44.709 98.2495 45.069 98.1001 45.3346 97.8346C45.6001 97.569 45.7495 97.209 45.75 96.8334V86.25C45.75 85.8522 45.592 85.4707 45.3107 85.1893C45.0294 84.908 44.6478 84.75 44.25 84.75ZM27.75 83.25H32.6897L34.1897 84.75H27.75V83.25ZM44.25 96.75H27.75V86.25H44.25V96.75Z"
      fill="currentColor"
    />
  </svg>
);

const LessonsIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default LessonsIcon;
