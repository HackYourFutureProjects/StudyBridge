import { NavLink } from "react-router-dom";
import { ChatSideBarItem } from "./ChatSideBarItem.tsx";
import { Peer } from "../../../api/chat/chat.types.ts";

type ChatSidebarItemType = {
  conversationId: string;
  peer: Peer;
  unreadCount?: number;
};

export const ChatSidebarItemLink = ({
  peer,
  conversationId,
  unreadCount = 0,
}: ChatSidebarItemType) => {
  return (
    <NavLink
      key={peer.id}
      to={conversationId}
      className={({ isActive }) =>
        `block rounded-[9px] p-3 ${isActive ? "bg-[#E0E7FF80]" : "hover:bg-white/5"}`
      }
    >
      <div className="flex items-center justify-between gap-3">
        <ChatSideBarItem name={peer.name} imageUrl={peer.imageUrl} />

        {unreadCount > 0 && (
          <span className="flex min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 py-0.5 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </NavLink>
  );
};
