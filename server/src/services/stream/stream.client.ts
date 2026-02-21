import { StreamClient } from "@stream-io/node-sdk";

/**
 * This file connects our app to Stream (the video service).
 * It uses the private keys from .env and creates one shared connection.
 * All video-call features use this same connection, so setup is in one place.
 */

// Starts empty, then stores the Stream client so we can reuse one shared connection.
let streamClientInstance: StreamClient | null = null;

type UserRole = "teacher" | "student";

const getRequiredEnv = (name: "STREAM_API_KEY" | "STREAM_SECRET"): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);

  return value;
};

export const getStreamApiKey = (): string => getRequiredEnv("STREAM_API_KEY");

export const getStreamClient = (): StreamClient => {
  // Return existing client if already initialized
  if (streamClientInstance) return streamClientInstance;

  const apiKey = getRequiredEnv("STREAM_API_KEY");
  const secret = getRequiredEnv("STREAM_SECRET");

  streamClientInstance = new StreamClient(apiKey, secret, { timeout: 3000 });
  return streamClientInstance;
};

//this func creates the login token frontend needs to join Stream video. In short:  it prepares “Stream login data” for the authenticated user.
export const createStreamToken = ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) => {
  const streamClient = getStreamClient();

  //generateUserToken:  proves user identity to Stream video service.
  const token = streamClient.generateUserToken({
    user_id: userId,
    validity_in_seconds: 2 * 60 * 60,
  });

  return {
    token,
    apiKey: getStreamApiKey(),
    userId,
    role,
  };
};
