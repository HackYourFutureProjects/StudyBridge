import { useEffect, useState } from "react";
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

const VideoLayout = () => {
  const { useHasOngoingScreenShare } = useCallStateHooks();
  const hasScreenShare = useHasOngoingScreenShare();

  return hasScreenShare ? <SpeakerLayout /> : <PaginatedGridLayout />;
};

export const VideoCallPage = () => {
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthSessionStore((s) => s.user);
  const { callId } = useParams<{ callId: string }>();
  const [searchParams] = useSearchParams();

  const streamCallId = searchParams.get("streamCallId");
  const streamCallType = searchParams.get("streamCallType") ?? "default";
  const hasInvalidParams =
    !callId || !streamCallId || !streamCallType || !streamCallId.trim();
  const backToAppointmentsPath =
    user?.role === "teacher"
      ? joinPath(teacherBase, teacherPrivatesRoutesVariables.appointments)
      : joinPath(studentBase, studentPrivatesRoutesVariables.appointments);

  useEffect(() => {
    if (hasInvalidParams) return;

    let mounted = true;
    let videoClient: StreamVideoClient | null = null;
    let videoCall: Call | null = null;

    const setup = async () => {
      try {
        const { apiKey, token, userId } = await getStreamToken();

        videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId },
          token,
        });

        videoCall = videoClient.call(streamCallType, streamCallId);
        await videoCall.join({ create: true });

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
  }, [hasInvalidParams, streamCallType, streamCallId]);

  const handleEndCall = async () => {
    if (!callId) {
      navigate(backToAppointmentsPath);
      return;
    }

    try {
      await endCallApi(callId);
    } catch (e) {
      console.error("Failed to end call in backend", e);
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

    navigate(backToAppointmentsPath);
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
            onClick={() => navigate(backToAppointmentsPath)}
            className="mt-5 rounded bg-white px-4 py-2 text-sm font-medium text-[#1B1823] hover:bg-[#E9ECF1]"
          >
            Back to appointments
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
            onClick={() => navigate(backToAppointmentsPath)}
            className="mt-5 rounded bg-white px-4 py-2 text-sm font-medium text-[#1B1823] hover:bg-[#E9ECF1]"
          >
            Back to appointments
          </button>
        </div>
      </div>
    );
  }

  if (!call) return <div className="p-6 text-white">Loading call...</div>;

  return (
    <div className="min-h-screen bg-[#15141D] p-4">
      <div className="mt-4 h-[80vh] rounded-[12px]">
        <StreamTheme className="str-video__theme-dark">
          <StreamCall call={call}>
            <VideoLayout />
            <div className="flex gap-3 justify-center mt-4">
              <ToggleAudioPublishingButton />
              <ToggleVideoPublishingButton />
              <ScreenShareButton />
              <button
                onClick={handleEndCall}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                End
              </button>
            </div>
          </StreamCall>
        </StreamTheme>
      </div>
    </div>
  );
};
