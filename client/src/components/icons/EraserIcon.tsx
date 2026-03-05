import {
  type Ref,
  type SVGProps,
  forwardRef,
  memo,
  type MemoExoticComponent,
  type ForwardRefExoticComponent,
} from "react";

const EraserIconComponent = (
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
    <path
      d="M19 19.9998H8.5L4.29 15.6998C4.10375 15.5125 3.99921 15.259 3.99921 14.9948C3.99921 14.7306 4.10375 14.4772 4.29 14.2898L14.29 4.28982C14.4774 4.10357 14.7308 3.99902 14.995 3.99902C15.2592 3.99902 15.5126 4.10357 15.7 4.28982L20.7 9.28982C20.8863 9.47718 20.9908 9.73063 20.9908 9.99482C20.9908 10.259 20.8863 10.5125 20.7 10.6998L11.5 19.9998M18 13.2998L11.7 6.99982"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EraserIcon = memo(forwardRef(EraserIconComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default EraserIcon;
