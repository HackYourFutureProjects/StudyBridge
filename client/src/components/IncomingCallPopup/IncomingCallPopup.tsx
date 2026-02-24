import { Button } from "../ui/button/Button";
import { VideoCallResponse } from "../../types/video.types";

type IncomingCallPopupProps = {
  call: VideoCallResponse | null;

  loading?: boolean;
  onAccept: (callId: string) => void | Promise<void>;
  onDecline: (callId: string) => void | Promise<void>;
};

export const IncomingCallPopup = ({
  call,
  loading = false,
  onAccept,
  onDecline,
}: IncomingCallPopupProps) => {
  if (!call) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-xl">
        <h2 className="text-[28px] font-semibold text-[#2E3A4D] text-center">
          Incoming Call
        </h2>

        <p className="mt-4 text-center text-[#5B6B7F] text-[18px]">
          Your teacher is calling you now.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            as="button"
            variant="success"
            className="flex-1"
            disabled={loading}
            onClick={() => onAccept(call.id)}
          >
            Accept
          </Button>

          <Button
            as="button"
            variant="info"
            className="flex-1 !bg-red-600 hover:!bg-red-700"
            disabled={loading}
            onClick={() => onDecline(call.id)}
          >
            Decline
          </Button>
        </div>

        <p className="mt-6 text-center text-[#7A889A] text-sm">
          This call will expire soon.
        </p>
      </div>
    </div>
  );
};
