// Load our .env variables
import dotenv from "dotenv";
import express from "express";
dotenv.config();

import connectDB from "./db/connectDB.js";
import app from "./app.js";
import { logError, logInfo } from "./utils/logging.js";

// The environment should set the port
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    connectDB()
      .then(() => logInfo("MongoDB connected"))
      .catch((err) => logError(err));
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
