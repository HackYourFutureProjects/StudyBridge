import { NavLink } from "react-router-dom";
import { ChatSideBarItem } from "./ChatSideBarItem.tsx";
import { Peer } from "../../../api/chat/chat.types.ts";

type ChatSidebarItemType = {
  conversationId: string;
  peer: Peer;
};

export const ChatSidebarItemLink = ({
  peer,
  conversationId,
}: ChatSidebarItemType) => {
  return (
    <NavLink
      key={peer.id}
      to={conversationId}
      className={({ isActive }) =>
        `block rounded-[9px] p-3 ${isActive ? "bg-[#E0E7FF80]" : "hover:bg-white/5"}`
      }
    >
      <ChatSideBarItem name={peer.name} imageUrl={peer.imageUrl} />
    </NavLink>
  );
};
