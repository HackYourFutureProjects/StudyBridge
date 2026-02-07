import { Outlet } from "react-router-dom";
import { useMeQuery } from "../features/auth/query/useMeQuery";
import { AuthBootstrap } from "../features/auth/AuthBootstrap";

export const RootLayout = () => {
  useMeQuery();
  return (
    <>
      <AuthBootstrap />
      <Outlet />
    </>
  );
};
