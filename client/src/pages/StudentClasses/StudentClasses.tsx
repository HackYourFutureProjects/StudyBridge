import { useState } from "react";
import {
  Sidebar,
  defaultStudentMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/header-private/TopBar";
import { Pagination } from "../../components/ui/pagination/Pagination";
import LessonsTable from "../../components/table/LessonsTable";
import { PageTitle } from "../../components/page-title/PageTitle";

export const StudentClasses = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={defaultStudentMenuItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

        <div className="pt-[40px] flex flex-col flex-1">
          <PageTitle title="My Classes" />

          <div className="mt-6" />
          <LessonsTable
            width={1065}
            headerHeight={66}
            rowHeight={66}
            columns={[
              { key: "lesson", label: "Lessons", width: "120px" },
              { key: "teacher", label: "Teachers", width: "180px" },
              { key: "date", label: "Date", width: "140px" },
              { key: "price", label: "Price", width: "120px" },
              { key: "videoCall", label: "Video call", width: "1fr" },
            ]}
            rows={[
              {
                id: 1,
                checked: false,
                lesson: "English",
                teacher: "Anna Tkachuk",
                date: "5/27/15",
                price: "25 euro",
                videoCall: "Join",
              },
              {
                id: 3,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
                date: "5/27/15",
                price: "25 euro",
                videoCall: "Join",
              },
              {
                id: 2,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
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
