import forbiddenImage from "../../assets/images/forbidden.png";
import { Button } from "../../components/ui/button/Button.tsx";
import { NavLink } from "react-router-dom";

export const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-dvh w-full">
      <img src={forbiddenImage} alt="forbidden" />
      <h1 className="text-light-100 text-[25px]">Access Denied</h1>
      <h3 className="text-[18px] text-gray-400">
        You do not have permission to visit this page!
      </h3>
      <Button as={NavLink} to={"/"} className="mt-6">
        Go home
      </Button>
    </div>
  );
};
