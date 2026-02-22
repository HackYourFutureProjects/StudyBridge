import { useParams } from "react-router-dom";
import { ChatSideBarItem } from "../../../components/chat/chatSidebarItem/ChatSideBarItem.tsx";
import { useMemo, useState } from "react";
import { formatDate } from "../../../util/data.util.ts";
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

export const ChatDialogPage = () => {
  const { id: conversationId } = useParams();
  const socket = useSocketStore((s) => s.socket);
  const myUserId = useAuthSessionStore((s) => s.user?.id);

  const { data: messages = [] } = useChatMessagesQuery(conversationId);
  const { data: conversations = [] } = useChatConversationsQuery();

  const conversation = useMemo(
    () => conversations.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );
  const peer = conversation?.peer;

  useChatRealtime({ socket, conversationId });

  const { typingUserId } = useTypingIndicator({
    socket,
    conversationId,
    myUserId,
  });
  const { emitTyping, stopTypingNow } = useTypingEmitter({
    socket,
    conversationId,
  });

  const [text, setText] = useState("");
  const send = useSendChatMessage({
    socket,
    conversationId,
    stopTypingNow,
    onSuccess: () => setText(""),
  });
  return (
    <div className="h-210.5 flex flex-col">
      <div className="p-3 mb-5">
        <ChatSideBarItem name={peer?.name} imageUrl={peer?.imageUrl} />
        {typingUserId ? (
          <div className="mt-1 text-xs text-white/50">
            {peer?.name} is typing…
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-auto px-7.75 py-2 bg-[#211C27] scrollbar-thin">
        {messages.map((m, index) => {
          const isMine = m.senderId === myUserId;
          const next = messages[index + 1];
          const showAvatar = !isMine && (!next || next.senderId !== m.senderId);

          return (
            <div
              key={m.id}
              className={[
                "mb-3",
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

              <div className="max-w-[75%]">
                <div
                  className={[
                    "rounded-2xl px-5 py-2 text-sm leading-relaxed mb-1.5",
                    isMine
                      ? "bg-purple-500 text-light-100 rounded-br-md"
                      : "bg-light-150 text-dark-900 rounded-bl-md",
                  ].join(" ")}
                >
                  <p>{m.text}</p>
                </div>
                <p className="text-light-600 text-[12px]">
                  {formatDate(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-3">
        <form
          className="flex gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
        >
          <TextField
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              emitTyping();
            }}
            placeholder="Type a message ..."
            variant="primarySmall"
          />
          <Button variant="primary" type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
