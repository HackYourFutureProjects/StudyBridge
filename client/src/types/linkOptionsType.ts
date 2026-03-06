import {
  ForwardRefExoticComponent,
  MemoExoticComponent,
  SVGProps,
} from "react";

export type LinkOption = {
  id: string;
  title: string;
  link?: string;
  icon?: MemoExoticComponent<
    ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  >;
  actionCallback?: () => void;
};
