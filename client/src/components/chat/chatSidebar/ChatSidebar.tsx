import { ChatSidebarItemLink } from "../chatSidebarItem/ChatSidebarItemLink.tsx";
import { useChatConversationsQuery } from "../../../features/chat/chat.query.ts";
import { LogoPulseIcon } from "../../LogoPulsIcon/LogoPulseIcon.tsx";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";

export const ChatSidebar = () => {
  const { data, isLoading } = useChatConversationsQuery();
  const role = useAuthSessionStore((s) => s.user?.role);
  if (isLoading) {
    return <LogoPulseIcon size="sm" />;
  }
  return (
    <aside className="border-r border-[#E0E7FF80] overflow-auto">
      <div className="p-3 space-y-2">
        {data?.map((c) => {
          const unreadCount =
            role === "teacher"
              ? (c.unreadCount?.teacher ?? 0)
              : (c.unreadCount?.student ?? 0);
          return (
            <ChatSidebarItemLink
              key={c.id}
              conversationId={c.id}
              peer={c.peer}
              unreadCount={unreadCount}
            />
          );
        })}
      </div>
    </aside>
  );
};
