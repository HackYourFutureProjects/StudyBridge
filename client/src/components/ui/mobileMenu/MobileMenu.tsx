import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import menuIcon from "../../../assets/icons/Menu Button.svg";
import crossIcon from "../../../assets/icons/cross.svg";

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
  <button
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
  </button>
);

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
              <img src={crossIcon} alt="Close" className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <nav className="py-4">
            <MobileMenuItem onClick={onClose}>
              <span className="font-medium">Tutors</span>
            </MobileMenuItem>
            <MobileMenuItem onClick={onClose}>
              <span className="font-medium">I want be tutor</span>
            </MobileMenuItem>
            <MobileMenuItem onClick={onClose}>
              <span className="font-medium">Sign in</span>
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
    <img src={menuIcon} alt="Menu" className="w-8 h-8" />
  </button>
);
