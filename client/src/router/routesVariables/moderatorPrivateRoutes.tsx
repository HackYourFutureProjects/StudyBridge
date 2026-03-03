import { RouteObject } from "react-router-dom";
import {
  chatRoutes,
  moderatorPrivatesRoutesVariables,
} from "./pathVariables.ts";
import { ChatPage } from "../../pages/chat/chatPage/ChatPage.tsx";
import { EmptyChat } from "../../pages/chat/EmptyChat/EmptyChat.tsx";
import { ChatDialogPage } from "../../pages/chat/chatDialogPage/ChatDialogPage.tsx";
import { ModeratorTeachersPage } from "../../pages/moderatorTeachersPage/ModeratorTeachersPage.tsx";
import { TeacherDetail } from "../../pages/teacherDetail/teacherDetail.tsx";

export const moderatorPrivateRoutes: RouteObject[] = [
  {
    path: moderatorPrivatesRoutesVariables.teachers,
    element: <ModeratorTeachersPage />,
  },
  {
    path: moderatorPrivatesRoutesVariables.teacher,
    element: <TeacherDetail />,
  },
  {
    path: chatRoutes.root,
    element: <ChatPage />,
    children: [
      { index: true, element: <EmptyChat /> },
      { path: chatRoutes.dialog, element: <ChatDialogPage /> },
    ],
  },
];
