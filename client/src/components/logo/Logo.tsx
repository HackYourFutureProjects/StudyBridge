import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";
import { twMerge } from "tailwind-merge";
import LogoIcon from "../icons/LogoIcon.tsx";

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
        <span className="text-white font-semibold">StudyBridge</span>
        <LogoIcon
          className="text-purple-500"
          style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.6))" }}
        />
      </div>
    </Button>
  );
};
