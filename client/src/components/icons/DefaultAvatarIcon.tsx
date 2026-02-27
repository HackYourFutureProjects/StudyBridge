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
    {...props}
    ref={ref}
    width="14"
    height="14"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="200" height="200" fill="#374151" />
    <circle cx="100" cy="80" r="35" fill="#9CA3AF" />
    <path
      d="M50 170C50 145 72 125 100 125C128 125 150 145 150 170"
      fill="#9CA3AF"
    />
  </svg>
);

const DefaultAvatarIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default DefaultAvatarIcon;
