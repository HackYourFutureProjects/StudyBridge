import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const dragStateRef = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (!dragStateRef.current.isDragging) return;
      setPosition({
        x: Math.max(8, event.clientX - dragStateRef.current.offsetX),
        y: Math.max(8, event.clientY - dragStateRef.current.offsetY),
      });
    };

    const onPointerUp = () => {
      dragStateRef.current.isDragging = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    dragStateRef.current.isDragging = true;
    dragStateRef.current.offsetX = event.clientX - rect.left;
    dragStateRef.current.offsetY = event.clientY - rect.top;
  };

  if (!call) return null;

  const teacherName = call.teacherName?.trim() || "Your teacher";
  const initials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="fixed z-[1000] w-[360px] max-w-[calc(100vw-2rem)]"
      style={
        position
          ? { left: position.x, top: position.y }
          : { right: "1rem", top: "1rem" }
      }
    >
      <div className="rounded-[14px] border border-[#E6ECF3] bg-white p-4 shadow-2xl">
        <div
          className="mb-2 h-2 cursor-move rounded"
          onPointerDown={handleDragStart}
        />
        <div className="flex items-center gap-3">
          {call.teacherAvatarUrl ? (
            <img
              src={call.teacherAvatarUrl}
              alt={teacherName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EEF5] text-[13px] font-semibold text-[#2E3A4D]">
              {initials || "T"}
            </div>
          )}
          <div>
            <h2 className="text-[16px] font-semibold text-[#2E3A4D] leading-tight">
              Incoming Call
            </h2>
            <p className="text-[#5B6B7F] text-[14px] leading-tight">
              {teacherName} is calling you
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
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
      </div>
    </div>
  );
};
