import { useState } from "react";
import {
  Sidebar,
  defaultTeacherMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/headerPrivate/TopBar";
import { PageTitle } from "../../components/pageTitle/PageTitle";
import LessonsTable from "../../components/table/LessonsTable";
import { Pagination } from "../../components/ui/pagination/Pagination";

export const TeacherAppointments = () => {
  const [page, setPage] = useState(1);

  const columns = [
    { key: "lesson", label: "Lessons", width: "130px" },
    { key: "student", label: "Students", width: "184px" },
    { key: "price", label: "Price", width: "146px" },
    { key: "date", label: "Date", width: "146px" },
    { key: "time", label: "Time", width: "146px" },
    { key: "status", label: "Status", width: "200px" },
  ];

  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={defaultTeacherMenuItems} />

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
            useStatusButtons={true}
            rows={[
              {
                id: 1,
                checked: false,
                lesson: "English",
                student: "Anna Tkachuk",
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
