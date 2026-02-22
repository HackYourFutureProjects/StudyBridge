import { RouteObject } from "react-router-dom";

import { chatRoutes, teacherPrivatesRoutesVariables } from "./pathVariables.ts";
import { TeacherDashboard } from "../../pages/privateTeachersPages/teacherDashboard/TeacherDashboard.tsx";
import { ClientsClasses } from "../../pages/privateStudentsPages/ClientsClasses/ClientsClasses.tsx";
import { ClientsBilling } from "../../pages/privateStudentsPages/clientsBilling/ClientsBilling.tsx";
import { TeacherProfile } from "../../pages/privateTeachersPages/teacherProfile/TeacherProfile.tsx";
import { TeacherAppointments } from "../../pages/privateTeachersPages/teacherAppointments/TeacherAppointments.tsx";
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
  {
    path: teacherPrivatesRoutesVariables.billings,
    element: <ClientsBilling />,
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
