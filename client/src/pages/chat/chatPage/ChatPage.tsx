import { ChatSidebar } from "../../../components/chat/chatSidebar/ChatSidebar.tsx";
import { Outlet } from "react-router-dom";

export const ChatPage = () => {
  return (
    <div className="h-[calc(100dvh-var(--header-height))] min-w-0">
      <div className="grid h-full grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[320px_1fr]">
        <ChatSidebar />
        <section className="min-w-0 overflow-auto">
          <Outlet />
        </section>
      </div>
    </div>
  );
};
