import { useState } from "react";
import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { MenuButton, MobileMenu } from "../ui/mobileMenu/MobileMenu";
import {
  authRoutesVariables,
  publicRoutesVariables,
} from "../../router/routesVariables/pathVariables";
import { Logo } from "../logo/Logo";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useMeStatusQuery } from "../../features/auth/query/useMeStatusQuery.tsx";
import { ProfileIndicatorSkeleton } from "../skeletons/ProfileIndicatorSkeleton.tsx";
import { HeaderNavSkeleton } from "../skeletons/HeaderNavSkeleton.tsx";
import {
  linkOptions,
  makePrivateLinkOptions,
} from "../../dummyData/LinkOptionsVariables.tsx";
import { ControlPanelTrigger } from "../controlPanel/ControlPanelTrigger.tsx";
import { IndicatorTrigger } from "../controlPanel/IndicatorTrigger.tsx";
import { useModalStore } from "../../store/modals.store.ts";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuth = useAuthSessionStore((s) => s.user !== null);
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const open = useModalStore((s) => s.open);

  const authInitDone = useAuthSessionStore((s) => s.authInitDone);

  const [hadSession] = useState(
    () => localStorage.getItem("hadSession") === "1",
  );

  const { isPending, isFetching } = useMeStatusQuery();

  const isMeLoading =
    (!authInitDone && hadSession) ||
    (!!accessToken && !isAuth && (isPending || isFetching));
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className="
            fixed top-0 left-0 z-50
            w-full h-[var(--header-height)]
            bg-[#15141D40]
            backdrop-blur-[12px]
        "
      >
        <div className="flex items-center justify-between mx-auto max-w-[1440px] h-full px-4 sm:px-6 md:px-8 lg:px-[151px]">
          <Logo />
          {isMeLoading ? (
            user?.role === "teacher" ? (
              <HeaderNavSkeleton />
            ) : (
              <HeaderNavSkeleton hideRegisterTutor={true} />
            )
          ) : (
            <div className="hidden md:flex justify-center gap-4 sm:gap-6 lg:gap-7 border border-[#ffffff15] rounded-[20px] px-4 sm:px-6 lg:px-[38px]">
              <Button
                as={NavLink}
                to={publicRoutesVariables.teachers}
                className="p-0 text-[#ffffff60] hover:text-light-100"
                variant="link"
              >
                Tutors
              </Button>
              {!(isAuth && user?.role === "teacher") && (
                <Button
                  as={NavLink}
                  to={authRoutesVariables.registerTutor}
                  className="p-0 text-[#ffffff60] hover:text-light-100"
                  variant="link"
                >
                  I want to be a tutor
                </Button>
              )}
            </div>
          )}

          {isMeLoading ? (
            <ProfileIndicatorSkeleton />
          ) : isAuth ? (
            <IndicatorTrigger options={makePrivateLinkOptions(open)} />
          ) : (
            <ControlPanelTrigger options={linkOptions} />
          )}
          <MenuButton
            onClick={handleMobileMenuToggle}
            isOpen={isMobileMenuOpen}
          />
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
};
