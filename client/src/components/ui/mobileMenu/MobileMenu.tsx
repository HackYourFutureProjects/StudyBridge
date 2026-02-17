import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import MenuIcon from "../../icons/Menu-button";
import CrossIcon from "../../icons/Cross";
import { Button } from "../button/Button.tsx";
import { NavLink } from "react-router-dom";
import {
  authRoutesVariables,
  publicRoutesVariables,
} from "../../../router/routesVariables/pathVariables.ts";
import LogoutIcon from "../../icons/LogoutIcon.tsx";
import { useModalStore } from "../../../store/modals.store.ts";
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  children,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="
      w-full text-left px-6 py-4
      text-[#ffffff60] hover:text-light-100
      transition-colors duration-200
      border-b border-[#ffffff15]
      hover:bg-[#ffffff08]
    "
  >
    {children}
  </div>
);

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { open } = useModalStore();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" />
        <Dialog.Content
          className="
          fixed top-0 right-0 h-full w-80 max-w-[80vw]
          bg-[#15141D] backdrop-blur-[12px]
          z-50 transform transition-transform duration-300 ease-in-out
          md:hidden
          shadow-2xl
        "
        >
          <div className="flex items-center justify-between p-6 border-b border-[#ffffff15]">
            <Dialog.Title className="text-xl font-semibold text-white">
              Menu
            </Dialog.Title>
            <Dialog.Close
              className="
                p-2 rounded-lg
                text-[#ffffff60] hover:text-light-100
                hover:bg-[#ffffff15]
                transition-all duration-200
              "
              aria-label="Close menu"
            >
              <CrossIcon className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <nav className="py-4">
            <MobileMenuItem onClick={onClose}>
              <Button
                variant="link"
                as={NavLink}
                to={publicRoutesVariables.teachers}
                className="font-medium"
              >
                Teachers
              </Button>
            </MobileMenuItem>
            <MobileMenuItem onClick={onClose}>
              <Button
                variant="link"
                as={NavLink}
                to={authRoutesVariables.registerTutor}
                className="font-medium"
              >
                I want to be a teacher
              </Button>
            </MobileMenuItem>
            <MobileMenuItem onClick={onClose}>
              <Button
                variant="link"
                as={NavLink}
                to={authRoutesVariables.loginStudent}
                className="font-medium"
              >
                Sign in as a student
              </Button>
            </MobileMenuItem>
            <MobileMenuItem onClick={onClose}>
              <Button
                variant="link"
                as={NavLink}
                to={authRoutesVariables.loginTutor}
                className="font-medium"
              >
                Sign in as a teacher
              </Button>
            </MobileMenuItem>
            <MobileMenuItem>
              <Button
                variant="link"
                onClick={() => open("logout")}
                className="flex items-center gap-2 md:gap-5 text-[#474747]
              hover:text-[#8A8A8A] transition-colors cursor-pointer"
              >
                <LogoutIcon className="w-5 h-5" />
                <span
                  className="hidden md:block font-semibold text-[16px]
                leading-[100%]"
                >
                  Logout
                </span>
              </Button>
            </MobileMenuItem>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface MenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className="
      p-2 rounded-lg
      text-[#ffffff60] hover:text-light-100
      hover:bg-[#ffffff15]
      transition-all duration-200
      md:hidden
    "
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <MenuIcon className="w-8 h-8" />
  </button>
);
