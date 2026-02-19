import { ChatSidebarItemLink } from "../chatSidebarItem/ChatSidebarItemLink.tsx";
import {
  chatPeopleList,
  mockConversations,
} from "../../../pages/chat/chatMockData.ts";

export const ChatSidebar = () => {
  return (
    <aside className="border-r border-[#E0E7FF80] overflow-auto">
      <div className="p-3 space-y-2">
        {mockConversations.map((c) => {
          const peer = chatPeopleList.find((u) => u.id === c.peerId);
          if (!peer) {
            return null;
          }
          return (
            <ChatSidebarItemLink key={c.id} conversationId={c.id} user={peer} />
          );
        })}
      </div>
    </aside>
  );
};
