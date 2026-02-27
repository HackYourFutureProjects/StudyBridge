import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";
import { twMerge } from "tailwind-merge";

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
      StudyBridge
    </Button>
  );
};
