import { useRef, useState } from "react";
import type { Call } from "@stream-io/video-client";
import { useWhiteboardSync } from "../../hooks/useWhiteboardSync";
import type { DrawTool } from "../../hooks/useWhiteboardSync";
import PenIcon from "../icons/PenIcon";
import EraserIcon from "../icons/EraserIcon";

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
  const [activeTool, setActiveTool] = useState<DrawTool>("pen");
  const [eraserSize, setEraserSize] = useState(24);

  // Hook that handles drawing + syncing with other users
  const {
    handlePointerDown,
    handlePointerMove,
    finishPointerStroke,
    clearBoard,
  } = useWhiteboardSync({
    call,
    selectedColor,
    activeTool,
    eraserSize,
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

        {/* Switch between normal drawing and erasing */}
        <button
          type="button"
          onClick={() => setActiveTool("pen")}
          className={`ml-1 rounded px-3 py-1 text-sm ${
            activeTool === "pen"
              ? "bg-[#3A3346] text-white"
              : "bg-[#2A2433] text-[#C6CAD3]"
          }`}
          title="Pen"
        >
          <PenIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("eraser")}
          className={`rounded px-3 py-1 text-sm ${
            activeTool === "eraser"
              ? "bg-[#3A3346] text-white"
              : "bg-[#2A2433] text-[#C6CAD3]"
          }`}
          title="Eraser"
        >
          {/* eraser icon is highlighted only when eraser tool is active */}
          <EraserIcon className="h-5 w-5" />
        </button>

        {/* user can choose eraser size */}
        {activeTool === "eraser" && (
          <div className="ml-2 flex items-center gap-2 text-xs text-[#C6CAD3]">
            <span>Size</span>
            <input
              type="range"
              min={8}
              max={48}
              step={1}
              value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="w-6 text-right">{eraserSize}</span>
          </div>
        )}

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
