import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  StreamCall,
  StreamTheme,
  PaginatedGridLayout,
  SpeakerLayout,
  StreamVideoClient,
  useCallStateHooks,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  ScreenShareButton,
} from "@stream-io/video-react-sdk";
import type { Call } from "@stream-io/video-client";
import {
  getStreamToken,
  endCall as endCallApi,
} from "../../api/video/video.api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthSessionStore } from "../../store/authSession.store";
import type { AxiosError } from "axios";
import {
  studentBase,
  studentPrivatesRoutesVariables,
  teacherBase,
  teacherPrivatesRoutesVariables,
} from "../../router/routesVariables/pathVariables";
import { joinPath } from "../../util/joinPath.util";
import { SharedWhiteboard } from "../../components/video/SharedWhiteboard";
import WhiteboardOpenIcon from "../../components/icons/WhiteboardOpenIcon";
import WhiteboardClosedIcon from "../../components/icons/WhiteboardClosedIcon";

const VideoLayout = () => {
  const { useHasOngoingScreenShare } = useCallStateHooks();
  const hasScreenShare = useHasOngoingScreenShare();

  return hasScreenShare ? <SpeakerLayout /> : <PaginatedGridLayout />;
};

type CallContentProps = {
  call: Call;
  whiteboardOpen: boolean;
  setWhiteboardOpen: Dispatch<SetStateAction<boolean>>;
  onEnd: () => void | Promise<void>;
  endButtonLabel: string;
};

type WhiteboardVisibilityEvent = {
  action: "visibility";
  open: boolean;
  senderClientId: string;
};

const CallContent = ({
  whiteboardOpen,
  setWhiteboardOpen,
  onEnd,
  call,
  endButtonLabel,
}: CallContentProps) => {
  const { useHasOngoingScreenShare } = useCallStateHooks();
  const hasScreenShare = useHasOngoingScreenShare();
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const myClientIdRef = useRef(crypto.randomUUID());
  const [leftPanelPercent, setLeftPanelPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  // Split layout only when screen share is active and whiteboard is open.
  const splitLayout = hasScreenShare && whiteboardOpen;

  useEffect(() => {
    if (!isResizing) return;

    const onPointerMove = (event: PointerEvent) => {
      const container = splitContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      if (!rect.width) return;

      const raw = ((event.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(30, Math.min(70, raw));
      setLeftPanelPercent(clamped);
    };

    const onPointerUp = () => setIsResizing(false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isResizing]);

  useEffect(() => {
    // Keep whiteboard visibility in sync between both participants.
    const off = call.on("custom", (event) => {
      const payload = event.custom?.whiteboardVisibility as
        | WhiteboardVisibilityEvent
        | undefined;
      if (!payload) return;
      if (payload.action !== "visibility") return;
      if (payload.senderClientId === myClientIdRef.current) return;
      setWhiteboardOpen(payload.open);
    });

    return () => off();
  }, [call, setWhiteboardOpen]);

  const toggleWhiteboard = async () => {
    const nextOpenState = !whiteboardOpen;
    setWhiteboardOpen(nextOpenState);

    try {
      await call.sendCustomEvent({
        whiteboardVisibility: {
          action: "visibility",
          open: nextOpenState,
          senderClientId: myClientIdRef.current,
        },
      });
    } catch (error) {
      console.error("Failed to sync whiteboard visibility", error);
    }
  };

  return (
    <>
      {splitLayout ? (
        <>
          {/* Desktop: video and whiteboard can be resized by dragging the divider. */}
          <div ref={splitContainerRef} className="hidden h-[72vh] lg:flex">
            <div
              style={{ width: `${leftPanelPercent}%` }}
              className="h-full pr-2"
            >
              <VideoLayout />
            </div>
            <button
              type="button"
              aria-label="Resize panels"
              onPointerDown={() => setIsResizing(true)}
              className="h-full w-2 cursor-col-resize rounded bg-[#2A2433] hover:bg-[#3A3346]"
            />
            <div
              style={{ width: `${100 - leftPanelPercent}%` }}
              className="h-full pl-2"
            >
              <SharedWhiteboard fullHeight call={call} />
            </div>
          </div>

          {/* Mobile/tablet: stack vertically for better usability. */}
          <div className="space-y-4 lg:hidden">
            <VideoLayout />
            <SharedWhiteboard call={call} />
          </div>
        </>
      ) : (
        <div>
          <VideoLayout />

          {/* Keep component mounted so board state/events are preserved while hidden. */}
          <div className={whiteboardOpen ? "mt-4" : "mt-4 hidden"}>
            <SharedWhiteboard call={call} />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-3">
        <ToggleAudioPublishingButton />
        <ToggleVideoPublishingButton />
        <ScreenShareButton />
        <button
          type="button"
          onClick={() => void toggleWhiteboard()}
          className="rounded bg-[#2A2433] px-4 py-2 text-white hover:bg-[#3A3346]"
          title={whiteboardOpen ? "Hide whiteboard" : "Show whiteboard"}
        >
          {/* Show different icon when whiteboard is open/closed */}
          {whiteboardOpen ? (
            <WhiteboardOpenIcon className="h-5 w-5" />
          ) : (
            <WhiteboardClosedIcon className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={onEnd}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          {endButtonLabel}
        </button>
      </div>
    </>
  );
};

export const VideoCallPage = () => {
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);

  const navigate = useNavigate();
  const user = useAuthSessionStore((s) => s.user);
  const { callId } = useParams<{ callId: string }>();
  const [searchParams] = useSearchParams();

  const streamCallId = searchParams.get("streamCallId");
  const streamCallType = searchParams.get("streamCallType") ?? "default";
  const requestedReturnTo = searchParams.get("returnTo");
  const safeReturnToPath =
    requestedReturnTo &&
    requestedReturnTo.startsWith("/") &&
    !requestedReturnTo.startsWith("//")
      ? requestedReturnTo
      : null;
  const hasInvalidParams =
    !callId || !streamCallId || !streamCallType || !streamCallId.trim();
  const backToAppointmentsPath =
    user?.role === "teacher"
      ? joinPath(teacherBase, teacherPrivatesRoutesVariables.appointments)
      : joinPath(studentBase, studentPrivatesRoutesVariables.appointments);
  const backPath = safeReturnToPath ?? backToAppointmentsPath;
  const isTeacher = user?.role === "teacher";
  const hasUserRole = user?.role === "teacher" || user?.role === "student";

  useEffect(() => {
    if (hasInvalidParams || !hasUserRole) return;

    let mounted = true;
    let videoClient: StreamVideoClient | null = null;
    let videoCall: Call | null = null;

    const setup = async () => {
      try {
        if (mounted) {
          setError(null);
        }
        const { apiKey, token, userId } = await getStreamToken();

        videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId },
          token,
        });

        videoCall = videoClient.call(streamCallType, streamCallId);
        // Only teachers can create a new call room; students can join only if it already exists.
        await videoCall.join({ create: isTeacher });

        if (!mounted) return;

        setCall(videoCall);
      } catch (e) {
        console.error("Video setup failed", e);
        const status = (e as AxiosError)?.response?.status;
        if (mounted) {
          if (status === 404 || status === 409 || status === 410) {
            setError("This call has already ended or is no longer available.");
            return;
          }

          setError("Failed to initialize video call. Please try again.");
        }
      }
    };

    setup();

    return () => {
      mounted = false;
      void videoCall?.leave();
      void videoClient?.disconnectUser();
      setCall(null);
    };
  }, [hasInvalidParams, hasUserRole, streamCallType, streamCallId, isTeacher]);

  const handleEndCall = async () => {
    if (!callId) {
      navigate(backPath);
      return;
    }

    if (isTeacher) {
      try {
        await endCallApi(callId);
      } catch (e) {
        console.error("Failed to end call in backend", e);
      }
    }

    try {
      await call?.leave();
    } catch (leaveError) {
      console.error("Failed to leave call", leaveError);
    }

    if (window.opener) {
      window.close();
      return;
    }

    navigate(backPath);
  };

  if (hasInvalidParams) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#15141D] p-6">
        <div className="w-full max-w-md rounded-xl border border-[#2A2433] bg-[#1B1823] p-6 text-center">
          <h2 className="text-lg font-semibold text-white">
            Missing call data
          </h2>
          <p className="mt-2 text-sm text-[#C6CAD3]">
            The call link is incomplete or invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="mt-5 rounded bg-white px-4 py-2 text-sm font-medium text-[#1B1823] hover:bg-[#E9ECF1]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#15141D] p-6">
        <div className="w-full max-w-md rounded-xl border border-[#2A2433] bg-[#1B1823] p-6 text-center">
          <h2 className="text-lg font-semibold text-white">
            Unable to join call
          </h2>
          <p className="mt-2 text-sm text-[#C6CAD3]">{error}</p>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="mt-5 rounded bg-white px-4 py-2 text-sm font-medium text-[#1B1823] hover:bg-[#E9ECF1]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!hasUserRole)
    return <div className="p-6 text-white">Loading call...</div>;

  if (!call) return <div className="p-6 text-white">Loading call...</div>;

  return (
    <div className="min-h-screen bg-[#15141D] p-4">
      <div className="mt-4 h-[80vh] rounded-[12px]">
        <StreamTheme className="str-video__theme-dark">
          <StreamCall call={call}>
            <CallContent
              call={call}
              whiteboardOpen={whiteboardOpen}
              setWhiteboardOpen={setWhiteboardOpen}
              onEnd={handleEndCall}
              endButtonLabel={isTeacher ? "End" : "Leave"}
            />
          </StreamCall>
        </StreamTheme>
      </div>
    </div>
  );
};
