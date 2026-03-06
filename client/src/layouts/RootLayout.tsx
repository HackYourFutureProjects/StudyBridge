import { Outlet, useNavigate } from "react-router-dom";
import { useMeQuery } from "../features/auth/query/useMeQuery";
import { AuthBootstrap } from "../features/auth/AuthBootstrap";
import { useAuthInit } from "../features/auth/query/useAuthInit";
import { NotificationCenter } from "../components/notificationCenter/NotificationCenter";
import { ModalHost } from "../components/modalHost/modalHost.tsx";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { useEffect, useRef, useState } from "react";
import { VideoCallResponse } from "../types/video.types.ts";
import { acceptCall, declineCall } from "../api/video/video.api.ts";
import { IncomingCallPopup } from "../components/IncomingCallPopup/IncomingCallPopup.tsx";
import { useSocketStore } from "../store/socket.store.ts";
import { useNotificationStore } from "../store/notification.store.ts";
import { useMouseFollowEffect } from "../hooks/useMouseFollowEffect";
import type { AxiosError } from "axios";
import { useAudioUnlock } from "../hooks/useAudioUnlock.ts";
import { useUnreadChatSync } from "../hooks/useUnreadChatSync.tsx";
import { useSocketConnection } from "../hooks/useSocketConnection.ts";
type IncomingCallSignal = VideoCallResponse & { callId?: string };

export const RootLayout = () => {
  const [incomingCall, setIncomingCall] = useState<VideoCallResponse | null>(
    null,
  );
  const [incomingLoading, setIncomingLoading] = useState(false);
  const user = useAuthSessionStore((s) => s.user);
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const navigate = useNavigate();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  const socket = useSocketStore((s) => s.socket);

  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useAuthInit();
  useMeQuery();
  useMouseFollowEffect();

  useAudioUnlock();

  useUnreadChatSync();
  useSocketConnection();

  useEffect(() => {
    // Student listens for incoming call event.
    if (!isStudent || !socket) return;

    const onIncoming = (payload: IncomingCallSignal) => {
      // Server may send callId; map it to id used in popup actions.
      const id = payload.id ?? payload.callId;
      if (!id) return;
      setIncomingCall({ ...payload, id });
    };

    socket.on("video:incoming", onIncoming);

    return () => {
      socket.off("video:incoming", onIncoming);
    };
  }, [isStudent, socket]);

  useEffect(() => {
    // Teacher listens for student response to call request.
    if (!isTeacher || !socket) return;

    // Student accepted the call.
    const onAccepted = () => {
      notifySuccess("Student joined");
    };

    // Student declined the call.
    const onDeclined = () => {
      notifyError("Student declined the call");
    };

    socket.on("video:accepted", onAccepted);
    socket.on("video:declined", onDeclined);

    return () => {
      socket.off("video:accepted", onAccepted);
      socket.off("video:declined", onDeclined);
    };
  }, [isTeacher, socket, notifySuccess, notifyError]);

  useEffect(() => {
    // Show ringtone and auto-decline if student does not answer in 1 minute.
    if (!incomingCall || incomingLoading) return;

    audioRef.current = new Audio("/incomingCallTone.mp3");
    audioRef.current.loop = true;
    void audioRef.current.play().catch(() => {
      // Browser blocked autoplay until user interacts with this tab.
    });

    timeoutRef.current = window.setTimeout(async () => {
      // Auto-close popup after 1 minute without calling backend decline.
      setIncomingCall(null);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }, 60_000);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    };
  }, [incomingCall, incomingLoading]);

  const handleAccept = async (callId: string) => {
    // Open tab first (inside click) so browser does not block popup.
    const callWindow = window.open("about:blank", "_blank");

    // Stop ringtone/timeout because user already took an action.
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;

    setIncomingLoading(true);
    try {
      const accepted = await acceptCall(callId);
      setIncomingCall(null);

      if (!accepted) return;

      const callUrl = `/call/${accepted.id}?streamCallId=${encodeURIComponent(
        accepted.streamCallId,
      )}&streamCallType=${encodeURIComponent(accepted.streamCallType)}`;

      if (!callWindow) {
        // Popup blocked: fallback to same-tab navigation.
        navigate(callUrl);
        return;
      }

      callWindow.location.href = callUrl;
    } catch (error) {
      callWindow?.close();
      console.error("Failed to accept incoming call", error);
    } finally {
      setIncomingLoading(false);
    }
  };

  const handleDecline = async (callId: string) => {
    // Stop ringtone/timeout because user already took an action.
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;

    setIncomingLoading(true);
    try {
      await declineCall(callId);
      setIncomingCall(null);
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      if (status !== 409) {
        console.error("Failed to decline incoming call", error);
      }
      setIncomingCall(null);
    } finally {
      setIncomingLoading(false);
    }
  };

  return (
    <>
      <AuthBootstrap />
      <Outlet />
      <NotificationCenter />
      <ModalHost />
      {isStudent && (
        <IncomingCallPopup
          call={incomingCall}
          loading={incomingLoading}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
};
