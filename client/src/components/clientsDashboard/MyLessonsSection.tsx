import LessonsTable from "../table/LessonsTable";
import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../pageTitle/PageTitle";
import { FindTeachersCard } from "./FindTeachersCard";
import { useStudentAppointmentsQuery } from "../../features/appointments/query/useAppointmentsQuery";
import { useAuthSessionStore } from "../../store/authSession.store";

export const MyLessonsSection = () => {
  const user = useAuthSessionStore((state) => state.user);
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useStudentAppointmentsQuery(user?.id || "");

  // Filter today's appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today,
  );

  const tableRows = todayAppointments.map((appointment) => ({
    id: appointment.id,
    checked: appointment.status === "approved",
    lesson: appointment.lesson,
    teacher: appointment.teacher || "N/A",
    price: appointment.price,
    videoCall: appointment.videoCall || "Join",
  }));

  return (
    <div>
      <PageTitle title="General" />
      <div className="mt-[24px] flex items-start justify-between gap-[40px]">
        <FindTeachersCard />
        <Calendar />
      </div>
      <PageTitle title="My lessons today" />
      <div className="mt-[28px]">
        {isLoading ? (
          <div className="text-white text-center py-8">
            Loading appointments...
          </div>
        ) : error ? (
          <div className="text-white text-center py-8">
            Error loading appointments
          </div>
        ) : tableRows.length === 0 ? (
          <div className="text-white text-center py-8">
            No lessons scheduled for today
          </div>
        ) : (
          <LessonsTable
            height={290}
            columns={[
              { key: "lesson", label: "Lessons", width: "130px" },
              { key: "teacher", label: "Teachers", width: "184px" },
              { key: "price", label: "Price", width: "146px" },
              { key: "videoCall", label: "Video call", width: "146px" },
            ]}
            rows={tableRows}
          />
        )}
      </div>
    </div>
  );
};
