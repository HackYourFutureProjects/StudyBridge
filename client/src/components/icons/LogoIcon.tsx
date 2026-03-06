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
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 200 200"
    ref={ref}
    {...props}
  >
    <g fill="currentColor">
      <path d="M 1 63 L 40 85 L 49 76 L 97 51 L 107 53 L 113 61 L 112 71 L 106 77 L 67 97 L 99 117 L 197 64 L 196 62 L 100 9 Z" />
      <path d="M 164 95 L 100 130 L 93 127 L 86 122 L 81 120 L 79 118 L 66 111 L 66 144 L 76 147 L 77 148 L 87 149 L 88 150 L 111 150 L 112 149 L 122 148 L 123 147 L 134 144 L 148 136 L 160 123 L 163 116 L 163 113 L 164 112 Z" />
      <path d="M 102 61 L 97 61 L 93 63 L 91 65 L 50 86 L 48 89 L 48 162 L 40 169 L 38 174 L 38 195 L 68 195 L 68 176 L 65 168 L 57 162 L 57 94 L 60 91 L 101 70 L 104 67 L 104 63 Z" />
      <path d="M 35 95 L 35 112 L 36 113 L 36 116 L 37 117 L 37 119 L 38 120 L 38 121 L 39 122 L 39 123 L 39 97 L 38 97 L 36 95 Z" />
    </g>
  </svg>
);

const LogoIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default LogoIcon;
