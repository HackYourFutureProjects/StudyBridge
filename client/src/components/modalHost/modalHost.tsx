import * as React from "react";
import { createPortal } from "react-dom";

import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation.tsx";
import { BookingConfirmation } from "../bookingConfirmation/BookingConfirmation.tsx";
import { SignInConfirmation } from "../auth/signInConfirmation/SignInConfirmation.tsx";
import { ConfirmDialog } from "../confirmDialog/ConfirmDialog.tsx";
import { AlertDialog } from "../alertDialog/AlertDialog.tsx";
import { useModalStore } from "../../store/modals.store.ts";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const overlayClass = cva(
  "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200",
  {
    variants: {
      opened: {
        true: "opacity-100 bg-black/50 pointer-events-auto",
        false: "opacity-0 bg-black/0 pointer-events-none",
      },
    },
    defaultVariants: {
      opened: false,
    },
  },
);

export const ModalHost = () => {
  const { activeModal, opened, close, finishClose, payload } = useModalStore();

  if (typeof document === "undefined") {
    return null;
  }

  const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    if (!opened && activeModal) {
      finishClose();
    }
  };

  if (!activeModal) {
    return null;
  }

  return createPortal(
    <div
      className={twMerge(overlayClass({ opened }))}
      onTransitionEnd={onTransitionEnd}
      onClick={opened ? close : undefined}
    >
      <div onClick={(e) => e.stopPropagation()} key={activeModal}>
        {activeModal === "logout" && (
          <LogoutConfirmation isOpen={opened} onClose={close} />
        )}
        {activeModal === "bookingConfirm" && (
          <BookingConfirmation isOpen={opened} onClose={close} />
        )}
        {activeModal === "signIn" && (
          <SignInConfirmation isOpen={opened} onClose={close} />
        )}
        {activeModal === "confirmDelete" &&
          payload &&
          "onConfirm" in payload && (
            <ConfirmDialog
              isOpen={opened}
              title={payload.title}
              message={payload.message}
              confirmText={payload.confirmText ?? "Confirm"}
              cancelText={payload.cancelText ?? "Cancel"}
              confirmVariant={payload.confirmVariant ?? "danger"}
              onConfirm={() => {
                payload.onConfirm();
                close();
              }}
              onCancel={close}
            />
          )}
        {activeModal === "alert" && payload && "title" in payload && (
          <AlertDialog
            isOpen={opened}
            title={payload.title}
            message={payload.message}
            onClose={close}
          />
        )}
      </div>
    </div>,
    document.body,
  );
};
