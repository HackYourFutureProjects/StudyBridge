import { ChatSidebar } from "../../../components/chat/chatSidebar/ChatSidebar.tsx";
import { Outlet } from "react-router-dom";

export const ChatPage = () => {
  return (
    <div className="h-[calc(100dvh-var(--header-height))] min-w-0 min-h-0">
      <div className="pl-14.5 mr-9 h-full min-h-0 pb-20 overflow-hidden">
        <h1 className="text-gradient text-[50px]">Chat</h1>

        <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[320px_1fr] border-t border-gray-200">
          <ChatSidebar />

          <section className="min-w-0 min-h-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};
