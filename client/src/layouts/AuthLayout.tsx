import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <>
      <div>Header</div>
      <main className="pt-[var(--header-height)]">
        <Outlet />
      </main>
    </>
  );
};
