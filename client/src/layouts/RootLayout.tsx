import { Outlet } from "react-router-dom";
import { useMeQuery } from "../features/auth/query/useMeQuery";
import { AuthBootstrap } from "../features/auth/AuthBootstrap";
import { useAuthInit } from "../features/auth/query/useAuthInit";
import { NotificationCenter } from "../components/notificationCenter/NotificationCenter";
import { ModalHost } from "../components/modalHost/modalHost.tsx";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { useEffect, useState } from "react";
import { VideoCallResponse } from "../types/video.types.ts";
import {
  acceptCall,
  declineCall,
  getIncomingCall,
} from "../api/video/video.api.ts";
import { IncomingCallPopup } from "../components/IncomingCallPopup/IncomingCallPopup.tsx";

export const RootLayout = () => {
  const [incomingCall, setIncomingCall] = useState<VideoCallResponse | null>(
    null,
  );
  const [incomingLoading, setIncomingLoading] = useState(false);
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const isStudent = user?.role === "student";

  useAuthInit();
  useMeQuery();

  useEffect(() => {
    if (!isStudent || !accessToken) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const call = await getIncomingCall();
        if (!cancelled) setIncomingCall(call);
      } catch {
        console.error("Incoming call polling failed");
      }
    };

    poll();
    const id = window.setInterval(poll, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isStudent, accessToken]);

  const handleAccept = async (callId: string) => {
    setIncomingLoading(true);
    try {
      await acceptCall(callId);
      setIncomingCall(null);
    } catch {
      console.error("Failed to accept incoming call");
    } finally {
      setIncomingLoading(false);
    }
  };

  const handleDecline = async (callId: string) => {
    setIncomingLoading(true);
    try {
      await declineCall(callId);
      setIncomingCall(null);
    } catch {
      console.error("Failed to decline incoming call");
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
