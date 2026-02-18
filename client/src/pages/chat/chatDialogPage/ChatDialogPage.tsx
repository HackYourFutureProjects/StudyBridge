import { useParams } from "react-router-dom";
import { ChatSideBarItem } from "../../../components/chat/chatSidebarItem/ChatSideBarItem.tsx";
import {
  chatPeopleList,
  mockConversations,
  mockCurrentUser,
  mockMessages,
} from "../chatMockData.ts";
import { useMemo } from "react";
import { formatDate } from "../../../util/data.util.ts";
import { TextField } from "../../../components/ui/textField/TextField.tsx";
import { Button } from "../../../components/ui/button/Button.tsx";

export const ChatDialogPage = () => {
  const { id } = useParams();
  const conversation = useMemo(
    () => mockConversations.find((c) => c.id === id),
    [id],
  );

  const peer = useMemo(() => {
    if (!conversation) return null;
    return chatPeopleList.find((u) => u.id === conversation.peerId) ?? null;
  }, [conversation]);

  const messages = useMemo(
    () => mockMessages.filter((m) => m.conversationId === id),
    [id],
  );

  if (!conversation || !peer) {
    return <div className="p-3">Not found messages</div>;
  }

  return (
    <div className="h-210.5 flex flex-col ">
      <div className="p-3 mb-5">
        <ChatSideBarItem name={peer?.name} imageUrl={peer?.imageUrl} />
      </div>

      <div className="flex-1 overflow-auto px-7.75 py-2 bg-[#211C27] scrollbar-thin">
        {messages.map((m, index) => {
          const isMine = m.senderId === mockCurrentUser.id;
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
                    peer.imageUrl ? (
                      <img
                        src={peer.imageUrl}
                        alt={peer.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                        {peer.name.slice(0, 1).toUpperCase()}
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

      <div className="border-t border-white/10 p-3 ">
        <form className="flex gap-2.5">
          <TextField
            className=""
            placeholder="Type a message ..."
            variant="primarySmall"
          />
          <Button variant="primary" type="button">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
