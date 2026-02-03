import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <>
      <div>Header</div>
      {/*pt-[var(--header-height)]*/}
      <main>
        <Outlet />
      </main>
      <div>Footer</div>
    </>
  );
};
