import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { Call } from "@stream-io/video-client";
import {
  applyPenStyle,
  resizeCanvasPreserveDrawing,
} from "../utils/whiteboardCanvas";

export type DrawTool = "pen" | "eraser";

type BoardPoint = {
  xRatio: number;
  yRatio: number;
};

type BoardStroke = {
  points: BoardPoint[];
  color: string;
  lineWidth: number;
  tool: DrawTool;
};

type BoardMessage =
  | {
      action: "stroke:commit";
      stroke: BoardStroke;
      senderClientId: string;
    }
  | {
      action: "clear";
      senderClientId: string;
    }
  | {
      action: "sync:request";
      senderClientId: string;
    }
  | {
      action: "sync:state";
      senderClientId: string;
      strokes: BoardStroke[];
    };

type UseBoardSyncArgs = {
  call?: Call | null;
  selectedColor: string;
  activeTool: DrawTool;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvasHostRef: RefObject<HTMLDivElement | null>;
};

const PEN_WIDTH = 3;
const ERASER_WIDTH = 14;
const ERASER_COLOR = "#FFFFFF";

// Send message; retry once if network is shaky.
const sendEventWithRetry = async (
  call: Call,
  payload: Record<string, unknown>,
) => {
  try {
    await call.sendCustomEvent(payload);
  } catch {
    setTimeout(() => {
      void call.sendCustomEvent(payload).catch((retryError) => {
        console.error(
          "Failed to send whiteboard event (after retry)",
          retryError,
        );
      });
    }, 120);
  }
};

export const useWhiteboardSync = ({
  call = null,
  selectedColor,
  activeTool,
  canvasRef,
  canvasHostRef,
}: UseBoardSyncArgs) => {
  // Points for the line that is being drawn right now.
  const currentStrokePointsRef = useRef<BoardPoint[]>([]);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // All lines currently on the board.
  const boardStrokesRef = useRef<BoardStroke[]>([]);
  const receivedBoardStateRef = useRef(false);
  const myClientIdRef = useRef(crypto.randomUUID());

  // We keep style in a ref so color/tool does not change mid-stroke.
  const currentStrokeStyleRef = useRef<{
    color: string;
    lineWidth: number;
    tool: DrawTool;
  }>({
    color: selectedColor,
    lineWidth: PEN_WIDTH,
    tool: activeTool,
  });

  const [isDrawing, setIsDrawing] = useState(false);

  const toCanvasRatio = useCallback(
    (x: number, y: number): BoardPoint => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.width || !canvas.height)
        return { xRatio: 0, yRatio: 0 };
      return { xRatio: x / canvas.width, yRatio: y / canvas.height };
    },
    [canvasRef],
  );

  const fromCanvasRatio = useCallback(
    (xRatio: number, yRatio: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      return { x: xRatio * canvas.width, y: yRatio * canvas.height };
    },
    [canvasRef],
  );

  // Draw one full stroke (used for incoming strokes and redraws).
  const drawSingleStroke = useCallback(
    (stroke: BoardStroke) => {
      const canvas = canvasRef.current;
      if (!canvas || stroke.points.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.strokeStyle = stroke.color;
      applyPenStyle(ctx, stroke.lineWidth);

      const start = fromCanvasRatio(
        stroke.points[0].xRatio,
        stroke.points[0].yRatio,
      );
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < stroke.points.length; i += 1) {
        const point = fromCanvasRatio(
          stroke.points[i].xRatio,
          stroke.points[i].yRatio,
        );
        ctx.lineTo(point.x, point.y);
      }

      if (stroke.points.length === 1) {
        ctx.lineTo(start.x + 0.01, start.y + 0.01);
      }

      ctx.stroke();
    },
    [canvasRef, fromCanvasRatio],
  );

  const clearCanvasPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const redrawBoard = useCallback(() => {
    clearCanvasPixels();
    for (const stroke of boardStrokesRef.current) {
      drawSingleStroke(stroke);
    }
  }, [clearCanvasPixels, drawSingleStroke]);

  const getBoardStorageKey = useCallback(() => {
    if (!call) return null;
    return `whiteboard:${call.cid}`;
  }, [call]);

  const saveBoardToSession = useCallback(
    (strokes: BoardStroke[]) => {
      const key = getBoardStorageKey();
      if (!key) return;
      try {
        sessionStorage.setItem(key, JSON.stringify(strokes));
      } catch {
        // Ignore storage failures.
      }
    },
    [getBoardStorageKey],
  );

  const sendBoardMessage = useCallback(
    async (payload: BoardMessage) => {
      if (!call) return;
      await sendEventWithRetry(call, { whiteboard: payload });
    },
    [call],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvasHostRef.current;
    if (!canvas || !host) return;
    const resize = () => resizeCanvasPreserveDrawing(canvas, host);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    return () => observer.disconnect();
  }, [canvasRef, canvasHostRef]);

  useEffect(() => {
    receivedBoardStateRef.current = false;
  }, [call?.cid]);

  // Restore local board after refresh.
  useEffect(() => {
    if (!call) return;
    const key = getBoardStorageKey();
    if (!key) return;
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BoardStroke[];
      if (!Array.isArray(parsed)) return;
      boardStrokesRef.current = parsed;
      receivedBoardStateRef.current = true;
      redrawBoard();
    } catch {
      // Ignore malformed session data.
    }
  }, [call, getBoardStorageKey, redrawBoard]);

  // Listen to partner updates and keep boards in sync.
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      const message = event.custom?.whiteboard as BoardMessage | undefined;
      if (!message) return;
      if (message.senderClientId === myClientIdRef.current) return;

      if (message.action === "sync:request") {
        void sendBoardMessage({
          action: "sync:state",
          senderClientId: myClientIdRef.current,
          strokes: boardStrokesRef.current,
        });
        return;
      }

      if (message.action === "sync:state") {
        receivedBoardStateRef.current = true;
        if (boardStrokesRef.current.length > 0) return;
        boardStrokesRef.current = message.strokes;
        saveBoardToSession(boardStrokesRef.current);
        redrawBoard();
        return;
      }

      if (message.action === "clear") {
        receivedBoardStateRef.current = true;
        boardStrokesRef.current = [];
        saveBoardToSession(boardStrokesRef.current);
        clearCanvasPixels();
        return;
      }

      receivedBoardStateRef.current = true;
      boardStrokesRef.current.push(message.stroke);
      saveBoardToSession(boardStrokesRef.current);
      drawSingleStroke(message.stroke);
    });

    const askForBoardState = () =>
      void sendBoardMessage({
        action: "sync:request",
        senderClientId: myClientIdRef.current,
      });

    const firstAskTimeout = window.setTimeout(askForBoardState, 300);
    const retryInterval = window.setInterval(() => {
      if (receivedBoardStateRef.current) return;
      askForBoardState();
    }, 1500);

    return () => {
      window.clearTimeout(firstAskTimeout);
      window.clearInterval(retryInterval);
      unsubscribe();
    };
  }, [
    call,
    clearCanvasPixels,
    drawSingleStroke,
    redrawBoard,
    saveBoardToSession,
    sendBoardMessage,
  ]);

  const getPointerPosition = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [canvasRef],
  );

  // Start a line with the current tool style.
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(e.pointerId);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getPointerPosition(e);
      currentStrokeStyleRef.current = {
        color: activeTool === "eraser" ? ERASER_COLOR : selectedColor,
        lineWidth: activeTool === "eraser" ? ERASER_WIDTH : PEN_WIDTH,
        tool: activeTool,
      };

      ctx.strokeStyle = currentStrokeStyleRef.current.color;
      applyPenStyle(ctx, currentStrokeStyleRef.current.lineWidth);
      ctx.beginPath();
      ctx.moveTo(x, y);

      setIsDrawing(true);
      currentStrokePointsRef.current = [toCanvasRatio(x, y)];
      lastPointerRef.current = { x, y };
    },
    [activeTool, canvasRef, getPointerPosition, selectedColor, toCanvasRatio],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getPointerPosition(e);
      ctx.lineTo(x, y);
      ctx.stroke();

      const prev = lastPointerRef.current;
      const dx = prev ? x - prev.x : 0;
      const dy = prev ? y - prev.y : 0;

      if (!prev || Math.hypot(dx, dy) >= 1.5) {
        currentStrokePointsRef.current.push(toCanvasRatio(x, y));
        lastPointerRef.current = { x, y };
      }
    },
    [canvasRef, getPointerPosition, isDrawing, toCanvasRatio],
  );

  // Finish stroke, save it, and share with everyone.
  const finishPointerStroke = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (canvas) canvas.releasePointerCapture(e.pointerId);

      setIsDrawing(false);
      lastPointerRef.current = null;

      const points = currentStrokePointsRef.current;
      currentStrokePointsRef.current = [];
      if (!points.length) return;

      const stroke: BoardStroke = {
        points,
        color: currentStrokeStyleRef.current.color,
        lineWidth: currentStrokeStyleRef.current.lineWidth,
        tool: currentStrokeStyleRef.current.tool,
      };

      boardStrokesRef.current.push(stroke);
      saveBoardToSession(boardStrokesRef.current);

      void sendBoardMessage({
        action: "stroke:commit",
        stroke,
        senderClientId: myClientIdRef.current,
      });
    },
    [canvasRef, saveBoardToSession, sendBoardMessage],
  );

  // Clear for everyone.
  const clearBoard = useCallback(() => {
    clearCanvasPixels();
    boardStrokesRef.current = [];
    saveBoardToSession(boardStrokesRef.current);
    currentStrokePointsRef.current = [];
    lastPointerRef.current = null;

    void sendBoardMessage({
      action: "clear",
      senderClientId: myClientIdRef.current,
    });
  }, [clearCanvasPixels, saveBoardToSession, sendBoardMessage]);

  return {
    handlePointerDown,
    handlePointerMove,
    finishPointerStroke,
    clearBoard,
  };
};
