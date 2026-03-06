import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";
import { twMerge } from "tailwind-merge";
import logoImage from "../../assets/logo.svg";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <NavLink
      to={publicRoutesVariables.home}
      className={twMerge("inline-flex items-center gap-2", className)}
    >
      <img src={logoImage} alt="StudyBridge" className="h-16 w-auto" />
      <span className="text-white text-2xl font-bold">Study Bridge</span>
    </NavLink>
  );
};
