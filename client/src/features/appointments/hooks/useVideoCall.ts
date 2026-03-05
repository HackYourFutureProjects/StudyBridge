import { useRef } from "react";
import { useModalStore } from "../../../store/modals.store";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { startCall } from "../../../api/video/video.api";

export const useVideoCall = () => {
  const { open: openModal } = useModalStore();
  const user = useAuthSessionStore((state) => state.user);
  const isStartingCallRef = useRef(false);

  const confirmStartCall = (
    studentId: string,
    appointmentId?: string,
    returnTo?: string,
  ) => {
    openModal("confirmDelete", {
      title: "Start Video Call",
      message: "Do you want to start this call now?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      confirmVariant: "primary",
      onConfirm: () => {
        void handleStartCall(studentId, appointmentId, returnTo);
      },
    });
  };

  const handleStartCall = async (
    studentId: string,
    appointmentId?: string,
    returnTo?: string,
  ) => {
    if (!user?.id) return;
    if (isStartingCallRef.current) return;
    isStartingCallRef.current = true;

    // Reuse one call tab/window so we do not open duplicates by mistake.
    const callWindow = window.open("about:blank", "studybridge-call-window");
    if (!callWindow) {
      openModal("alert", {
        title: "Popup blocked",
        message: "Please allow popups for this site, then try again.",
      });
      isStartingCallRef.current = false;
      return;
    }

    try {
      const call = await startCall({
        teacherId: user.id,
        studentId,
        appointmentId: appointmentId ?? undefined,
        streamCallId: `call_${crypto.randomUUID()}`,
      });

      const params = new URLSearchParams({
        streamCallId: call.streamCallId,
        streamCallType: call.streamCallType,
      });
      if (returnTo) {
        params.set("returnTo", returnTo);
      }
      const callUrl = `/call/${call.id}?${params.toString()}`;

      callWindow.location.href = callUrl;
    } catch {
      callWindow.close();
    } finally {
      isStartingCallRef.current = false;
    }
  };

  return { confirmStartCall };
};
