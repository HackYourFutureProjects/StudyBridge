import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";

export const AuthLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-[var(--header-height)]">
        <Outlet />
      </main>
    </>
  );
};
