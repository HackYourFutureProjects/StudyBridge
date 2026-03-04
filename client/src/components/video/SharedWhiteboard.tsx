import { useRef, useState } from "react";
import type { Call } from "@stream-io/video-client";
import { useWhiteboardSync } from "../../hooks/useWhiteboardSync";

// Preset pen colors
const COLORS = ["#111827", "#2563EB", "#EF4444", "#16A34A"] as const;

type SharedWhiteboardProps = {
  fullHeight?: boolean; // if true, fill the parent height
  call?: Call | null; // video call used for syncing
};

export const SharedWhiteboard = ({
  fullHeight = false,
  call = null,
}: SharedWhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // the drawing area
  const canvasHostRef = useRef<HTMLDivElement | null>(null); // container (used for resize)
  const [selectedColor, setSelectedColor] = useState<(typeof COLORS)[number]>(
    COLORS[0], // default color
  );

  // Hook that handles drawing + syncing with other users
  const {
    handlePointerDown,
    handlePointerMove,
    finishPointerStroke,
    clearBoard,
  } = useWhiteboardSync({
    call,
    selectedColor,
    canvasRef,
    canvasHostRef,
  });

  return (
    <div
      className={`rounded-xl border border-[#2A2433] bg-[#1B1823] p-3 ${
        fullHeight ? "h-full" : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        {/* Color picker */}
        {COLORS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setSelectedColor(preset)}
            className={`h-7 w-7 rounded-full border-2 ${
              selectedColor === preset ? "border-white" : "border-transparent"
            }`}
            style={{ backgroundColor: preset }}
            title="Pen color"
          />
        ))}

        {/* Clear the board for everyone */}
        <button
          type="button"
          onClick={clearBoard}
          className="ml-2 rounded bg-red-600 px-3 py-1 text-sm text-white"
        >
          Clear
        </button>
      </div>

      <div
        ref={canvasHostRef}
        className={`w-full rounded-md bg-white ${
          fullHeight ? "h-[calc(100%-52px)] min-h-[360px]" : "h-[440px]"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none rounded-md"
          onPointerDown={handlePointerDown} // start drawing
          onPointerMove={handlePointerMove} // keep drawing
          onPointerUp={finishPointerStroke} // finish stroke
          onPointerLeave={finishPointerStroke} // also finish if pointer leaves
        />
      </div>
    </div>
  );
};
