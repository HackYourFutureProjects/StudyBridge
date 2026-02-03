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
    width="94"
    height="94"
    viewBox="0 0 94 94"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="94"
      height="94"
      rx="47"
      fill="url(#paint0_linear_21_4532)"
      fillOpacity="0.05"
    />
    <rect
      x="12"
      y="12"
      width="70"
      height="70"
      rx="35"
      fill="url(#paint1_linear_21_4532)"
      fillOpacity="0.1"
    />
    <rect
      x="12.5"
      y="12.5"
      width="69"
      height="69"
      rx="34.5"
      stroke="url(#paint2_linear_21_4532)"
      strokeOpacity="0.2"
    />
    <g clipPath="url(#clip0_21_4532)">
      <path
        d="M61.7076 47.3456C61.7076 46.3259 61.6249 45.3007 61.4485 44.2976H47.3V50.0738H55.4022C55.066 51.9368 53.9857 53.5848 52.4039 54.632V58.3799H57.2376C60.0761 55.7674 61.7076 51.9092 61.7076 47.3456Z"
        fill="#7286FF"
      />
      <path
        d="M47.2999 62.001C51.3454 62.001 54.7572 60.6727 57.2429 58.3799L52.4092 54.6319C51.0644 55.5469 49.3282 56.065 47.3054 56.065C43.3921 56.065 40.0741 53.4249 38.8836 49.8754H33.8955V53.739C36.4419 58.8043 41.6284 62.001 47.2999 62.001Z"
        fill="#7286FF"
      />
      <path
        d="M38.8782 49.8754C38.2499 48.0124 38.2499 45.9952 38.8782 44.1322V40.2686H33.8957C31.7682 44.507 31.7682 49.5006 33.8957 53.7391L38.8782 49.8754Z"
        fill="#7286FF"
      />
      <path
        d="M47.2999 37.9371C49.4384 37.904 51.5053 38.7087 53.0541 40.1858L57.3366 35.9033C54.6249 33.3569 51.0258 31.9569 47.2999 32.001C41.6284 32.001 36.4419 35.1978 33.8955 40.2685L38.8781 44.1322C40.0631 40.5772 43.3866 37.9371 47.2999 37.9371Z"
        fill="#7286FF"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_21_4532"
        x1="47"
        y1="0"
        x2="47"
        y2="94"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9051F1" />
        <stop offset="1" stopColor="#9051F1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_21_4532"
        x1="47"
        y1="-34.3514"
        x2="47"
        y2="192.676"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9051F1" />
        <stop offset="0.467671" stopColor="#9051F1" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_21_4532"
        x1="47"
        y1="-109.554"
        x2="47"
        y2="145.378"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9051F1" />
        <stop offset="0.716291" stopColor="#9051F1" stopOpacity="0" />
      </linearGradient>
      <clipPath id="clip0_21_4532">
        <rect
          width="30"
          height="30"
          fill="white"
          transform="translate(32 32)"
        />
      </clipPath>
    </defs>
  </svg>
);
const SvgIcon = memo(forwardRef(SvgComponent)) as MemoExoticComponent<
  ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
>;

export default SvgIcon;
