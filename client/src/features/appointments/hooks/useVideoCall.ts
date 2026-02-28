import { useModalStore } from "../../../store/modals.store";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { startCall } from "../../../api/video/video.api";

export const useVideoCall = () => {
  const { open: openModal } = useModalStore();
  const user = useAuthSessionStore((state) => state.user);

  const confirmStartCall = (studentId: string, appointmentId?: string) => {
    openModal("confirmDelete", {
      title: "Start Video Call",
      message: "Do you want to start this call now?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      confirmVariant: "primary",
      onConfirm: () => {
        void handleStartCall(studentId, appointmentId);
      },
    });
  };

  const handleStartCall = async (studentId: string, appointmentId?: string) => {
    if (!user?.id) return;

    const callWindow = window.open("about:blank", "_blank");
    if (!callWindow) {
      openModal("alert", {
        title: "Popup blocked",
        message: "Please allow popups for this site, then try again.",
      });
      return;
    }

    try {
      const call = await startCall({
        teacherId: user.id,
        studentId,
        appointmentId: appointmentId ?? undefined,
        streamCallId: `call_${crypto.randomUUID()}`,
      });

      const callUrl = `/call/${call.id}?streamCallId=${encodeURIComponent(
        call.streamCallId,
      )}&streamCallType=${encodeURIComponent(call.streamCallType)}`;

      callWindow.location.href = callUrl;
    } catch {
      callWindow.close();
    }
  };

  return { confirmStartCall };
};
