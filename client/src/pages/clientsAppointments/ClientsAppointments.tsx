import { useState } from "react";
import {
  Sidebar,
  defaultStudentMenuItems,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/headerPrivate/TopBar";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import LessonsTable from "../../components/table/LessonsTable";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useLocation } from "react-router-dom";

export const ClientsAppointments = () => {
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();
  const accountType = useAuthSessionStore((s) => s.accountType ?? s.user?.role);

  const inferredType =
    accountType ?? (pathname.startsWith("/teacher") ? "teacher" : "student");

  const isTeacher = inferredType === "teacher";
  const sidebarItems = isTeacher
    ? defaultTeacherMenuItems
    : defaultStudentMenuItems;

  const columns = isTeacher
    ? [
        { key: "lesson", label: "Lessons", width: "130px" },
        { key: "student", label: "Students", width: "184px" },
        { key: "price", label: "Price", width: "146px" },
        { key: "date", label: "Date", width: "146px" },
        { key: "time", label: "Time", width: "146px" },
        { key: "status", label: "Status", width: "200px" },
      ]
    : [
        { key: "lesson", label: "Lessons", width: "130px" },
        { key: "teacher", label: "Teachers", width: "184px" },
        { key: "price", label: "Price", width: "146px" },
        { key: "date", label: "Date", width: "146px" },
        { key: "time", label: "Time", width: "146px" },
        { key: "status", label: "Status", width: "200px" },
      ];

  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={sidebarItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

        <div className="pt-[40px] flex flex-col flex-1">
          <PageTitle title="My Appointments" />

          <div className="mt-6" />

          <LessonsTable
            width={1200}
            headerHeight={66}
            rowHeight={66}
            columns={columns}
            rows={[
              {
                id: 1,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 2,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 3,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 4,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 5,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 6,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 7,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
              {
                id: 8,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
                teacher: "Anna Tkachuk",
                price: "25 euro",
                date: "5/27/15",
                time: "2:00 PM",
                status: "pending",
              },
            ]}
          />

          <div className="mt-auto pt-4 mb-6 flex justify-center">
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
