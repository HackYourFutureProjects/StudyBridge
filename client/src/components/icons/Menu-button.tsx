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
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    ref={ref}
  >
    <rect x="10.417" y="35.834" width="29.1667" height="3.33333" fill="white" />
    <rect x="10.417" y="27.5" width="29.1667" height="3.33333" fill="white" />
    <rect x="10.417" y="19.166" width="29.1667" height="3.33333" fill="white" />
    <rect x="10.417" y="10.834" width="29.1667" height="3.33333" fill="white" />
  </svg>
);

const MenuButtonIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default MenuButtonIcon;
