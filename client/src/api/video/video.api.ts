import { apiProtected } from "../api.ts";
import {
  StartCallRequest,
  VideoCallResponse,
  StreamTokenResponse,
} from "../../types/video.types.ts";

export async function startCall(
  body: StartCallRequest,
): Promise<VideoCallResponse> {
  const res = await apiProtected.post<VideoCallResponse>(
    "/api/video-calls/start",
    body,
  );
  return res.data;
}

export async function getIncomingCall(): Promise<VideoCallResponse | null> {
  const res = await apiProtected.get<VideoCallResponse | null>(
    `/api/video-calls/incoming`,
  );
  return res.data;
}

export async function acceptCall(
  callId: string,
): Promise<VideoCallResponse | null> {
  const res = await apiProtected.post<VideoCallResponse | null>(
    `/api/video-calls/${callId}/accept`,
  );
  return res.data;
}

export async function declineCall(
  callId: string,
): Promise<VideoCallResponse | null> {
  const res = await apiProtected.post<VideoCallResponse | null>(
    `/api/video-calls/${callId}/decline`,
  );
  return res.data;
}

export async function endCall(
  callId: string,
): Promise<VideoCallResponse | null> {
  const res = await apiProtected.post<VideoCallResponse | null>(
    `/api/video-calls/${callId}/end`,
  );
  return res.data;
}

export async function getStreamToken(): Promise<StreamTokenResponse> {
  const res = await apiProtected.get<StreamTokenResponse>(`api/stream/token`);
  return res.data;
}
