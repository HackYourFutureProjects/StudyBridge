import { ReactNode } from "react";

type ModalOverlayProps = {
  children: ReactNode;
};

export const ModalOverlay = ({ children }: ModalOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                    transition-opacity duration-200 opacity-100 bg-black/50"
    >
      {children}
    </div>
  );
};
