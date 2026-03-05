import {
  ForwardRefExoticComponent,
  MemoExoticComponent,
  SVGProps,
} from "react";

export type linkOption = {
  id: string;
  title: string;
  link?: string;
  icon?: MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  >;
  actionCallback?: () => void;
};
