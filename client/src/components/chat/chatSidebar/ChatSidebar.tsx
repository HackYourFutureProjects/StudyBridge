import { ChatSidebarItemLink } from "../chatSidebarItem/ChatSidebarItemLink.tsx";
import { useChatConversationsQuery } from "../../../features/chat/chat.query.ts";
import { LogoPulseIcon } from "../../LogoPulsIcon/LogoPulseIcon.tsx";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { TextField } from "../../ui/textField/TextField.tsx";
import Search from "../../icons/Search.tsx";
import { useMemo, useState } from "react";
export const ChatSidebar = () => {
  const { data, isLoading } = useChatConversationsQuery();
  const [sortedConversations, setSortedConversations] = useState<string>("");
  const role = useAuthSessionStore((s) => s.user?.role);
  const finalChats = useMemo(() => {
    const query = sortedConversations?.toLowerCase().trim();
    if (!query) {
      return data ?? [];
    }
    return (data ?? []).filter((item) =>
      item.peer.name.toLowerCase().includes(query),
    );
  }, [data, sortedConversations]);

  if (isLoading) {
    return <LogoPulseIcon size="sm" />;
  }

  return (
    <aside className="md:border-r md:border-[#E0E7FF80]  pt-6.25 pr-7.25 h-full min-h-0 flex flex-col">
      <TextField
        value={sortedConversations}
        onChange={(e) => setSortedConversations(e.target.value)}
        placeholder="Search"
        variant="dashboard"
        className="text-gray-300"
        containerClassName="bg-"
        iconClassName="text-gray-300"
        Icon={Search}
        type="search"
      />
      <div className="space-y-2 min-h-0 flex flex-col">
        <h3 className="text-gray-300 mt-[20px] shrink-0">DIRECT MASSAGES</h3>
        <div className="scrollbar-thin flex flex-col gap-2 min-h-0 overflow-y-auto">
          {finalChats?.length ? (
            finalChats.map((c) => {
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
            })
          ) : (
            <div className="text-light-100/70 text-sm p-4 text-center">
              No chats yet
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
