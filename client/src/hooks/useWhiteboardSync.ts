import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { Call } from "@stream-io/video-client";
import {
  applyPenStyle,
  resizeCanvasPreserveDrawing,
} from "../utils/whiteboardCanvas";

// Store points as ratios so drawings resize nicely with the canvas
type BoardPoint = {
  xRatio: number;
  yRatio: number;
};

// One finished stroke (all points + color)
type BoardStroke = {
  points: BoardPoint[];
  color: string;
};

// Messages we send over the call to keep everyone in sync
type BoardMessage =
  | {
      action: "stroke:commit";
      points: BoardPoint[];
      color: string;
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
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvasHostRef: RefObject<HTMLDivElement | null>;
};

// Send an event, and if it fails  try once more
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
  canvasRef,
  canvasHostRef,
}: UseBoardSyncArgs) => {
  // Points for the stroke we're currently drawing
  const currentStrokePointsRef = useRef<BoardPoint[]>([]);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // Everything that has been drawn so far
  const boardStrokesRef = useRef<BoardStroke[]>([]);

  // Once we get any board data, we stop spamming sync requests
  const receivedBoardStateRef = useRef(false);

  const activeStrokeColorRef = useRef(selectedColor);

  // Used to ignore own events when they come back through the call
  const myClientIdRef = useRef(crypto.randomUUID());

  const [isDrawing, setIsDrawing] = useState(false);

  // Pixels -> ratios
  const toCanvasRatio = useCallback(
    (x: number, y: number): BoardPoint => {
      const canvas = canvasRef.current;

      if (!canvas || !canvas.width || !canvas.height)
        return { xRatio: 0, yRatio: 0 };

      return { xRatio: x / canvas.width, yRatio: y / canvas.height };
    },
    [canvasRef],
  );

  // Ratios -> pixels
  const fromCanvasRatio = useCallback(
    (xRatio: number, yRatio: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      return { x: xRatio * canvas.width, y: yRatio * canvas.height };
    },
    [canvasRef],
  );

  // Draw one stroke (used for replay + incoming strokes)
  const drawSingleStroke = useCallback(
    (points: BoardPoint[], color: string) => {
      const canvas = canvasRef.current;
      if (!canvas || points.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.strokeStyle = color;
      applyPenStyle(ctx);

      const start = fromCanvasRatio(points[0].xRatio, points[0].yRatio);

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < points.length; i += 1) {
        const point = fromCanvasRatio(points[i].xRatio, points[i].yRatio);
        ctx.lineTo(point.x, point.y);
      }

      // If it's just a tap/click, draw a tiny dot
      if (points.length === 1) {
        ctx.lineTo(start.x + 0.01, start.y + 0.01);
      }

      ctx.stroke();
    },
    [canvasRef, fromCanvasRatio],
  );

  // Clear the canvas (visual only)
  const clearCanvasPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  // Repaint everything from our stored strokes
  const redrawBoard = useCallback(() => {
    clearCanvasPixels();

    for (const stroke of boardStrokesRef.current) {
      drawSingleStroke(stroke.points, stroke.color);
    }
  }, [clearCanvasPixels, drawSingleStroke]);

  // Namespacing session storage by call id
  const getBoardStorageKey = useCallback(() => {
    if (!call) return null;
    return `whiteboard:${call.cid}`;
  }, [call]);

  // Persist strokes so refreshes don't wipe the board (per call)
  const saveBoardToSession = useCallback(
    (strokes: BoardStroke[]) => {
      const key = getBoardStorageKey();
      if (!key) return;

      try {
        sessionStorage.setItem(key, JSON.stringify(strokes));
      } catch {
        // storage can fail (private mode, quota, etc.) — not critical
      }
    },
    [getBoardStorageKey],
  );

  // Wrapper so we always send messages in the same format
  const sendBoardMessage = useCallback(
    async (payload: BoardMessage) => {
      if (!call) return;
      await sendEventWithRetry(call, { whiteboard: payload });
    },
    [call],
  );

  // Keep the canvas size in sync with its container
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

  // New call = treat it like a fresh sync
  useEffect(() => {
    receivedBoardStateRef.current = false;
  }, [call?.cid]);

  // On join/refresh, try to restore from session storage first
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
      // ignore bad data
    }
  }, [call, getBoardStorageKey, redrawBoard]);

  // Listen for incoming board messages + do initial sync
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      const message = event.custom?.whiteboard as BoardMessage | undefined;

      if (!message) return;

      // Don't process our own events
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

        // If we already have something, don't overwrite it
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

      // Incoming stroke
      receivedBoardStateRef.current = true;

      boardStrokesRef.current.push({
        points: message.points,
        color: message.color,
      });

      saveBoardToSession(boardStrokesRef.current);

      drawSingleStroke(message.points, message.color);
    });

    // Ask others for the current board when we join
    const askForBoardState = () =>
      void sendBoardMessage({
        action: "sync:request",
        senderClientId: myClientIdRef.current,
      });

    const firstAskTimeout = window.setTimeout(askForBoardState, 300);

    // If nobody replies, retry for a bit
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

  // Pointer coords relative to the canvas element
  const getPointerPosition = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef],
  );

  // Start a new stroke
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture(e.pointerId);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getPointerPosition(e);

      activeStrokeColorRef.current = selectedColor;
      ctx.strokeStyle = activeStrokeColorRef.current;

      applyPenStyle(ctx);

      ctx.beginPath();
      ctx.moveTo(x, y);

      setIsDrawing(true);

      currentStrokePointsRef.current = [toCanvasRatio(x, y)];
      lastPointerRef.current = { x, y };
    },
    [canvasRef, getPointerPosition, selectedColor, toCanvasRatio],
  );

  // Keep drawing while the pointer moves
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

      // Avoid storing a million points for tiny movements
      if (!prev || Math.hypot(dx, dy) >= 1.5) {
        currentStrokePointsRef.current.push(toCanvasRatio(x, y));
        lastPointerRef.current = { x, y };
      }
    },
    [canvasRef, getPointerPosition, isDrawing, toCanvasRatio],
  );

  // Finish the stroke and broadcast it
  const finishPointerStroke = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (canvas) canvas.releasePointerCapture(e.pointerId);

      setIsDrawing(false);
      lastPointerRef.current = null;

      const points = currentStrokePointsRef.current;
      currentStrokePointsRef.current = [];

      if (!points.length) return;

      const strokeColor = activeStrokeColorRef.current;

      boardStrokesRef.current.push({
        points,
        color: strokeColor,
      });

      saveBoardToSession(boardStrokesRef.current);

      void sendBoardMessage({
        action: "stroke:commit",
        points,
        color: strokeColor,
        senderClientId: myClientIdRef.current,
      });
    },
    [canvasRef, saveBoardToSession, sendBoardMessage],
  );

  // Clear locally + tell everyone else to clear too
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
