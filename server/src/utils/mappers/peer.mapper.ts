import { PeerMinimal } from "../../types/chat/chat.types.js";

export const mapPeer = (peerId: string, peer: PeerMinimal | null) => ({
  id: peerId,
  name: peer
    ? `${peer.firstName ?? ""} ${peer.lastName ?? ""}`.trim() || peer.email
    : "Unknown",
  imageUrl: peer?.profileImageUrl ?? null,
});
