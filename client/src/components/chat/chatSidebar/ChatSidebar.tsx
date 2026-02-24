import { ChatSidebarItemLink } from "../chatSidebarItem/ChatSidebarItemLink.tsx";
import { useChatConversationsQuery } from "../../../features/chat/chat.query.ts";
import { Loader } from "../../loader/Loader.tsx";

export const ChatSidebar = () => {
  const { data, isLoading } = useChatConversationsQuery();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <aside className="border-r border-[#E0E7FF80] overflow-auto">
      <div className="p-3 space-y-2">
        {data?.map((c) => {
          return (
            <ChatSidebarItemLink
              key={c.id}
              conversationId={c.id}
              peer={c.peer}
            />
          );
        })}
      </div>
    </aside>
  );
};
