// This function sets how the drawing pen should look
// It controls the thickness and how the lines end and connect
export const applyPenStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 3; // thickness of the line
  ctx.lineCap = "round"; // makes the ends of lines rounded instead of sharp
  ctx.lineJoin = "round"; // makes corners between lines smooth
};

// This function resizes the canvas when the container changes size
// while keeping the drawing that was already made
export const resizeCanvasPreserveDrawing = (
  canvas: HTMLCanvasElement,
  host: HTMLDivElement,
) => {
  // Get the current size of the container (the element that holds the canvas)
  const rect = host.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  // Create a temporary canvas to save the current drawing
  const snapshot = document.createElement("canvas");
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;

  const snapshotCtx = snapshot.getContext("2d");

  // Copy the current drawing into the temporary canvas
  if (snapshotCtx && canvas.width > 0 && canvas.height > 0) {
    snapshotCtx.drawImage(canvas, 0, 0);
  }

  // Resize the real canvas to match the container
  canvas.width = Math.floor(rect.width);
  canvas.height = Math.floor(rect.height);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Reapply the drawing style after resizing
  applyPenStyle(ctx);

  // Put the saved drawing back onto the resized canvas
  if (snapshot.width > 0 && snapshot.height > 0) {
    ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
  }
};
