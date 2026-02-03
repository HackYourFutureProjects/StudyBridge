import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";
export const Logo = () => {
  return (
    <Button
      as={NavLink}
      to={publicRoutesVariables.home}
      className="
                    font-bold text-[25.2px]
                    leading-[100%]
                    tracking-[-0.14px]
                    text-light-100
                "
      variant="link"
    >
      StudyBridge
    </Button>
  );
};
