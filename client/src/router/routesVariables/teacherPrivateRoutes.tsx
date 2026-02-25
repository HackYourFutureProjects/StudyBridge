import { RouteObject } from "react-router-dom";
import { chatRoutes, teacherPrivatesRoutesVariables } from "./pathVariables.ts";
import { TeacherDashboard } from "../../pages/privetTeachersPages/teacherDashboard/TeacherDashboard.tsx";
import { ClientsClasses } from "../../pages/privateStudentsPages/ClientsClasses/ClientsClasses.tsx";
import { TeacherProfile } from "../../pages/privetTeachersPages/teacherProfile/TeacherProfile.tsx";
import { TeacherAppointments } from "../../pages/privetTeachersPages/teacherAppointments/TeacherAppointments.tsx";
import { ChatDialogPage } from "../../pages/chat/chatDialogPage/ChatDialogPage.tsx";
import { ChatPage } from "../../pages/chat/chatPage/ChatPage.tsx";
import { EmptyChat } from "../../pages/chat/EmptyChat/EmptyChat.tsx";

export const teacherPrivateRoutes: RouteObject[] = [
  {
    path: teacherPrivatesRoutesVariables.dashboard,
    element: <TeacherDashboard />,
  },
  { path: teacherPrivatesRoutesVariables.classes, element: <ClientsClasses /> },
  {
    path: teacherPrivatesRoutesVariables.myStudents,
    element: <ClientsClasses />,
  },
  { path: teacherPrivatesRoutesVariables.profile, element: <TeacherProfile /> },
  {
    path: chatRoutes.root,
    element: <ChatPage />,
    children: [
      { index: true, element: <EmptyChat /> },
      { path: chatRoutes.dialog, element: <ChatDialogPage /> },
    ],
  },
  {
    path: teacherPrivatesRoutesVariables.appointments,
    element: <TeacherAppointments />,
  },
];
