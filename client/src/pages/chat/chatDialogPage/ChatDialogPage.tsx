import { useParams } from "react-router-dom";
import { ChatSideBarItem } from "../../../components/chat/chatSidebarItem/ChatSideBarItem.tsx";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../../util/date.util.ts";
import { TextField } from "../../../components/ui/textField/TextField.tsx";
import { Button } from "../../../components/ui/button/Button.tsx";
import {
  useChatConversationsQuery,
  useChatMessagesQuery,
} from "../../../features/chat/chat.query.ts";
import { useSocketStore } from "../../../store/socket.store.ts";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { useSendChatMessage } from "../../../hooks/useSendChatMessage.ts";
import { useTypingEmitter } from "../../../hooks/useTypingEmitter.ts";
import { useTypingIndicator } from "../../../hooks/useTypingIndicator.ts";
import { useChatRealtime } from "../../../hooks/useChatRealtime.ts";
import { usePresenceStore } from "../../../store/presence.store.ts";
import { markConversationAsRead } from "../../../api/chat/chai.api.ts";

export const ChatDialogPage = () => {
  const { id: conversationId } = useParams();
  const socket = useSocketStore((s) => s.socket);
  const myUserId = useAuthSessionStore((s) => s.user?.id);

  const { data: conversations = [] } = useChatConversationsQuery();

  const conversation = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const { data: messages = [] } = useChatMessagesQuery(
    conversationId,
    Boolean(conversation),
  );

  const peer = conversation?.peer;
  const peerId = peer?.id;

  useChatRealtime({
    socket,
    conversationId: conversation ? conversationId : undefined,
    myUserId,
  });

  const { typingUserId } = useTypingIndicator({
    socket,
    conversationId: conversation ? conversationId : undefined,
    myUserId,
  });

  const { emitTyping, stopTypingNow } = useTypingEmitter({
    socket,
    conversationId: conversation ? conversationId : undefined,
  });

  const [text, setText] = useState("");

  const send = useSendChatMessage({
    socket,
    conversationId: conversation ? conversationId : undefined,
    stopTypingNow,
    onSuccess: () => setText(""),
  });

  const isOnline = usePresenceStore((s) =>
    peerId ? s.isOnline(peerId) : false,
  );

  useEffect(() => {
    if (!conversationId || !socket || !conversation) {
      return;
    }

    void markConversationAsRead(conversationId).catch(() => {});
  }, [conversationId, socket, conversation]);

  if (!conversation) {
    return <div className="p-4 text-light-500">Conversation not found</div>;
  }

  return (
    <div
      className="
      flex flex-col h-full max-h-210 min-h-0 overflow-hidden rounded-2xl
    "
    >
      <div className="shrink-0 px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <ChatSideBarItem name={peer?.name} imageUrl={peer?.imageUrl} />
          <span
            className={[
              "h-2 w-2 rounded-full",
              isOnline ? "bg-green-400" : "bg-light-100",
            ].join(" ")}
          />
        </div>

        <div className="mt-1 h-4 text-xs text-light-500">
          {typingUserId && peer?.name ? `${peer.name} is typing…` : null}
        </div>
      </div>

      <div
        className="
        flex-1 min-h-0 overflow-y-auto
        bg-[#211C27]
        px-3 py-2 md:px-6 md:py-2
        scrollbar-thin
      "
      >
        {messages.map((m, index) => {
          const isMine = m.senderId === myUserId;
          const next = messages[index + 1];
          const showAvatar = !isMine && (!next || next.senderId !== m.senderId);

          return (
            <div
              key={m.id}
              className={[
                "mb-2 md:mb-3",
                isMine ? "flex justify-end" : "flex justify-start",
              ].join(" ")}
            >
              {!isMine && (
                <div className="mr-2 w-8 shrink-0">
                  {showAvatar ? (
                    peer?.imageUrl ? (
                      <img
                        src={peer.imageUrl}
                        alt={peer.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                        {peer?.name?.slice(0, 1).toUpperCase()}
                      </div>
                    )
                  ) : (
                    <div className="h-8 w-8" />
                  )}
                </div>
              )}

              <div className="max-w-[85%] md:max-w-[75%]">
                <div
                  className={[
                    "rounded-2xl px-4 py-2 md:px-5 md:py-2 text-sm leading-relaxed mb-1 whitespace-pre-wrap break-words",
                    isMine
                      ? "bg-purple-500 text-light-100 rounded-br-md"
                      : "bg-light-150 text-dark-900 rounded-bl-md",
                  ].join(" ")}
                >
                  <p>{m.text}</p>
                </div>
                <p className="text-light-600 text-[11px] md:text-[12px]">
                  {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-white/10 px-3 py-2 md:px-4 md:py-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
        >
          <div className="min-w-0 flex-1">
            <TextField
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                emitTyping();
              }}
              placeholder="Type a message ..."
              variant="primarySmall"
              containerClassName="w-full"
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            className="shrink-0 px-4 md:px-[55px]"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
