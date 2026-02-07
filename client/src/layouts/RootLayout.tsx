import { Outlet } from "react-router-dom";
import { useMeQuery } from "../features/auth/query/useMeQuery";
import { AuthBootstrap } from "../features/auth/AuthBootstrap";
import { useAuthInit } from "../features/auth/query/useAuthInit";

export const RootLayout = () => {
  useAuthInit();
  useMeQuery();
  return (
    <>
      <AuthBootstrap />
      <Outlet />
    </>
  );
};
