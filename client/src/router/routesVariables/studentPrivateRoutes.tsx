import { RouteObject } from "react-router-dom";
import { chatRoutes, studentPrivatesRoutesVariables } from "./pathVariables.ts";
import { ClientsDashboard } from "../../pages/privateStudentsPages/ClientsDashboard/ClientsDashboard.tsx";
import { ClientsClasses } from "../../pages/privateStudentsPages/ClientsClasses/ClientsClasses.tsx";
import { ClientsAppointments } from "../../pages/privateStudentsPages/clientsAppointments/ClientsAppointments.tsx";
import { StudentProfile } from "../../pages/privateStudentsPages/studentProfile/StudentProfile.tsx";
import { ChatPage } from "../../pages/chat/chatPage/ChatPage.tsx";
import { ChatDialogPage } from "../../pages/chat/chatDialogPage/ChatDialogPage.tsx";
import { EmptyChat } from "../../pages/chat/EmptyChat/EmptyChat.tsx";
import { VideoCallPage } from "../../pages/videoCall/VideoCallPage.tsx";

export const studentPrivateRoutes: RouteObject[] = [
  { index: true, element: <ClientsDashboard /> },
  { path: studentPrivatesRoutesVariables.classes, element: <ClientsClasses /> },
  {
    path: studentPrivatesRoutesVariables.videoCall,
    element: <VideoCallPage />,
  },
  {
    path: studentPrivatesRoutesVariables.appointments,
    element: <ClientsAppointments />,
  },
  {
    path: studentPrivatesRoutesVariables.profile,
    element: <StudentProfile />,
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
