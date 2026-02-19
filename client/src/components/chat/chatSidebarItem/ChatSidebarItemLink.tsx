import { NavLink } from "react-router-dom";
import { ChatSideBarItem } from "./ChatSideBarItem.tsx";
import { ChatUser } from "../../../pages/chat/chatMockData.ts";

type ChatSidebarItemType = {
  conversationId: string;
  user: ChatUser;
};

export const ChatSidebarItemLink = ({
  user,
  conversationId,
}: ChatSidebarItemType) => {
  return (
    <NavLink
      key={user.id}
      to={conversationId}
      className={({ isActive }) =>
        `block rounded-[9px] p-3 ${isActive ? "bg-[#E0E7FF80]" : "hover:bg-white/5"}`
      }
    >
      <ChatSideBarItem name={user.name} imageUrl={user.imageUrl} />
    </NavLink>
  );
};
