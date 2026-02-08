import { useState } from "react";
import {
  Sidebar,
  defaultStudentMenuItems,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/header-private/TopBar";
import { Pagination } from "../../components/ui/pagination/Pagination";
import LessonsTable from "../../components/table/LessonsTable";
import { PageTitle } from "../../components/page-title/PageTitle";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useLocation } from "react-router-dom";

export const ClientsClasses = () => {
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();

  const accountType = useAuthSessionStore((s) => s.accountType ?? s.user?.role);
  const inferredType =
    accountType ?? (pathname.startsWith("/teacher") ? "teacher" : "student");
  const isTeacher = inferredType === "teacher";
  const isMyStudents = pathname === "/teacher/my-students";
  const sidebarItems = isTeacher
    ? defaultTeacherMenuItems
    : defaultStudentMenuItems;

  const columns = isMyStudents
    ? [
        { key: "student", label: "Students", width: "260px" },
        { key: "price", label: "Price", width: "160px" },
        { key: "videoCall", label: "Video call", width: "1fr" },
      ]
    : isTeacher
      ? [
          { key: "lesson", label: "Lessons", width: "120px" },
          { key: "student", label: "Students", width: "180px" },
          { key: "date", label: "Date", width: "140px" },
          { key: "price", label: "Price", width: "120px" },
          { key: "videoCall", label: "Video call", width: "1fr" },
        ]
      : [
          { key: "lesson", label: "Lessons", width: "120px" },
          { key: "teacher", label: "Teachers", width: "180px" },
          { key: "date", label: "Date", width: "140px" },
          { key: "price", label: "Price", width: "120px" },
          { key: "videoCall", label: "Video call", width: "1fr" },
        ];

  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={sidebarItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

        <div className="pt-[40px] flex flex-col flex-1">
          <PageTitle title={isMyStudents ? "My Students" : "My Classes"} />

          <div className="mt-6" />
          <LessonsTable
            width={isMyStudents ? 718 : 1065}
            headerHeight={66}
            rowHeight={66}
            columns={columns}
            rows={[
              {
                id: 1,
                checked: false,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",
                videoCall: "Join",
              },
              {
                id: 3,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",
                videoCall: "Join",
              },
              {
                id: 2,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",
                videoCall: "Join",
              },
            ]}
          />

          <div className="mt-auto mb-6 flex justify-center pt-6">
            <Pagination
              activeIndex={page}
              onIndexChange={setPage}
              totalPages={6}
              theme="secondary"
              shape="square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
