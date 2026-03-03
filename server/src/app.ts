import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoute.js";
import { appointmentRouter } from "./routes/appointmentRoute.js";
import { globalErrorMiddleware } from "./middlewares/global.middleware.js";
import { teacherRouter } from "./routes/teacherRoute.js";
import { reviewRouter } from "./routes/reviewRoute.js";
import { studentRouter } from "./routes/studentRoute.js";
import { chatRouter } from "./routes/chatRoute.js";
import { streamRouter } from "./routes/streamRoute.js";
import { videoCallRouter } from "./routes/videoCallRoute.js";
import { subjectRouter } from "./routes/subjectRoute.js";
import { uploadRouter } from "./routes/uploadRoute.js";
import { moderatorRouter } from "./routes/moderatorRoute.js";

// Create an express server
const app = express();
app.use(cookieParser());
// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/auth", authRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/students", studentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/stream", streamRouter);
app.use("/api/video-calls", videoCallRouter);
app.use("/api/moderator", moderatorRouter);
app.use("/api/upload", uploadRouter);
app.use(globalErrorMiddleware);

export default app;
