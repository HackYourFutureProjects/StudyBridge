import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";

export const PublicLayout = () => {
  return (
    <>
      <Header />
      {/*pt-[var(--header-height)]*/}
      <main>
        <Outlet />
      </main>
      <div>Footer</div>
    </>
  );
};
