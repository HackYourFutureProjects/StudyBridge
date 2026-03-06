import notFound from "../../assets/images/notFound.png";
import { Button } from "../../components/ui/button/Button.tsx";
import { NavLink } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-dvh w-full">
      <img src={notFound} alt="notFound" />
      <h1 className="text-light-100 text-[25px]">Something is wrong</h1>
      <h3 className="text-[18px] text-gray-400">
        The page you are looking was moved, removed, renamed, or might never
        exist!
      </h3>
      <Button as={NavLink} to={"/"} className="mt-6">
        Go home
      </Button>
    </div>
  );
};
