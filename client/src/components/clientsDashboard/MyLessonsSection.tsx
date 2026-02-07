import LessonsTable from "../table/LessonsTable";
import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../page-title/PageTitle";
import { FindTeachersCard } from "./FindTeachersCard";

export const MyLessonsSection = () => {
  return (
    <div>
      <PageTitle title="General" />
      <div className="mt-[24px] flex items-start justify-between gap-[40px]">
        <FindTeachersCard />
        <Calendar />
      </div>
      <PageTitle title="My lessons today" />
      <div className="mt-[28px]">
        <LessonsTable
          height={290}
          columns={[
            { key: "lesson", label: "Lessons", width: "130px" },
            { key: "teacher", label: "Teachers", width: "184px" },
            { key: "price", label: "Price", width: "146px" },
            { key: "videoCall", label: "Video call", width: "146px" },
          ]}
          rows={[
            {
              id: 1,
              checked: true,
              lesson: "English",
              teacher: "Anna Tkachuk",
              price: "25 euro",
              videoCall: "Join",
            },
            {
              id: 2,
              checked: true,
              lesson: "English",
              teacher: "Anna Tkachuk",
              price: "25 euro",
              videoCall: "Join",
            },
            {
              id: 3,
              checked: false,
              lesson: "English",
              teacher: "Anna Tkachuk",
              price: "25 euro",
              videoCall: "Join",
            },
            {
              id: 4,
              checked: false,
              lesson: "English",
              teacher: "Anna Tkachuk",
              price: "25 euro",
              videoCall: "Join",
            },
          ]}
        />
      </div>
    </div>
  );
};
