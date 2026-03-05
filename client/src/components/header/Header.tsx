import { useState } from "react";
import { Button } from "../ui/button/Button";
import { NavLink } from "react-router-dom";
import { ControlPanel } from "../controlPanel/ControlPanel";
import { MenuButton, MobileMenu } from "../ui/mobileMenu/MobileMenu";
import {
  authRoutesVariables,
  publicRoutesVariables,
} from "../../router/routesVariables/pathVariables";
import { Logo } from "../logo/Logo";
import { useAuthSessionStore } from "../../store/authSession.store";
import { ProfileIndicator } from "../profileIndicator/ProfileIndicator.tsx";
import { useMeStatusQuery } from "../../features/auth/query/useMeStatusQuery.tsx";
import { ProfileIndicatorSkeleton } from "../skeletons/ProfileIndicatorSkeleton.tsx";
import { HeaderNavSkeleton } from "../skeletons/HeaderNavSkeleton.tsx";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuth = useAuthSessionStore((s) => s.user !== null);
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            <g fill="#000">
              <path d="M 1 63 L 40 85 L 49 76 L 97 51 L 107 53 L 113 61 L 112 71 L 106 77 L 67 97 L 99 117 L 197 64 L 196 62 L 100 9 Z" />
              <path d="M 164 95 L 100 130 L 93 127 L 86 122 L 81 120 L 79 118 L 66 111 L 66 144 L 76 147 L 77 148 L 87 149 L 88 150 L 111 150 L 112 149 L 122 148 L 123 147 L 134 144 L 148 136 L 160 123 L 163 116 L 163 113 L 164 112 Z" />
              <path d="M 102 61 L 97 61 L 93 63 L 91 65 L 50 86 L 48 89 L 48 162 L 40 169 L 38 174 L 38 195 L 68 195 L 68 176 L 65 168 L 57 162 L 57 94 L 60 91 L 101 70 L 104 67 L 104 63 Z" />
              <path d="M 35 95 L 35 112 L 36 113 L 36 116 L 37 117 L 37 119 L 38 120 L 38 121 L 39 122 L 39 123 L 39 97 L 38 97 L 36 95 Z" />
            </g>
          </svg>
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
            <ProfileIndicator />
          ) : (
            <ControlPanel />
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
