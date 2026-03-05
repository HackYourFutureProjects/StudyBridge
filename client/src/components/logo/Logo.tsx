import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";
import { twMerge } from "tailwind-merge";
import LogoIconMain from "../icons/LogoIconMain.tsx";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <Button
      as={NavLink}
      to={publicRoutesVariables.home}
      className={twMerge(
        `
          font-bold text-[25.2px]
          leading-[100%]
          tracking-[-0.14px]
          text-light-100
        `,
        className,
      )}
      variant="link"
    >
      <div className="flex gap-3 items-center">
        <span className="text-purple-700 font-semibold">
          <LogoIconMain />
        </span>
      </div>
    </Button>
  );
};
