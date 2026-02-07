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
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 16C1.1 16 0.75 15.85 0.45 15.55C0.15 15.25 0 14.9 0 14.5V1.5C0 1.1 0.15 0.75 0.45 0.45C0.75 0.15 1.1 0 1.5 0H14.5C14.9 0 15.25 0.15 15.55 0.45C15.85 0.75 16 1.1 16 1.5V6.875L20 2.875V13.125L16 9.125V14.5C16 14.9 15.85 15.25 15.55 15.55C15.25 15.85 14.9 16 14.5 16H1.5Z"
      fill="currentColor"
    />
  </svg>
);

const VideoCallIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default VideoCallIcon;
