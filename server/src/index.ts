// Load our .env variables
import dotenv from "dotenv";
import express from "express";
import http from "http";
dotenv.config();

import connectDB from "./db/connectDB.js";
import app from "./app.js";
import { logError, logInfo } from "./utils/logging.js";
import { TeacherModel } from "./db/schemes/teacherSchema.js";
import { initSocketServer } from "./socket/socket.server.js";
// he environment should set the port
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    // 1. find all teacher documents where `timezone` does not exist.
    // 2. set `timezone` to "Europe/Amsterdam" for those old records.
    // 3. keep existing timezone values unchanged for all other teachers.
    const result = await TeacherModel.updateMany(
      { timezone: { $exists: false } },
      { $set: { timezone: "Europe/Amsterdam" } },
    );

    logInfo(`Timezone backfill updated ${result.modifiedCount} teacher(s)`);
    initSocketServer(server);
    // await initEmailTransporter();
    app.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
};

/****** Host our client code for Heroku *****/
/**
 * We only want to host our client code when in production mode as we then want to use the production build that is built in the dist folder.
 * When not in production, don't host the files, but the development version of the app can connect to the backend itself.
 */
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  // Redirect * requests to give the client data
  app.get("/*file", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

// Start the server
startServer();
