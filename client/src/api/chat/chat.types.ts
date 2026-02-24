export type Peer = { id: string; name: string; imageUrl: string | null };
export type ConversationListItemDTO = {
  id: string;
  peer: Peer;
  lastMessage?: { text: string; senderId: string; createdAt: string };
  updatedAt: string;
  lastMessageAt?: string;
};

export type MessageDTO = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
