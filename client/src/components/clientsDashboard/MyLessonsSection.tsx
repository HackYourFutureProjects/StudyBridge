import LessonsTable from "../table/LessonsTable";
import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../pageTitle/PageTitle";
import { FindTeachersCard } from "./FindTeachersCard";
import { useStudentAppointmentsQuery } from "../../features/appointments/query/useAppointmentsQuery";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useAppointmentTime } from "../../features/appointments/hooks/useAppointmentTime";
import { isInternalVideoCallLink } from "../appointmentCard/appointmentCard.utils";
import { Button } from "../ui/button/Button";
import {
  studentBase,
  studentPrivatesRoutesVariables,
} from "../../router/routesVariables/pathVariables";
import { joinPath } from "../../util/joinPath.util";
import { useMemo } from "react";

export const MyLessonsSection = () => {
  const user = useAuthSessionStore((state) => state.user);
  const { data, isLoading, error } = useStudentAppointmentsQuery(
    user?.id || "",
  );
  const { isPastAppointment } = useAppointmentTime();
  const studentDashboardPath = joinPath(
    studentBase,
    studentPrivatesRoutesVariables.dashboard,
  );

  const appointments = data?.appointments || [];

  const today = new Date().toISOString().split("T")[0];

  const openCallTab = (url: string) => {
    const opened = window.open(url, "_blank");
    if (!opened) {
      window.location.href = url;
    }
  };

  const tableRows = useMemo(() => {
    const todayAppointments = appointments.filter(
      (appointment) =>
        appointment.date === today && appointment.status === "approved",
    );

    return todayAppointments.map((appointment) => {
      const isPast = isPastAppointment(appointment.date, appointment.time);
      const callLink = appointment.videoCall ?? "";
      const canJoin = !isPast && isInternalVideoCallLink(callLink) && callLink;
      const videoCallHref = canJoin
        ? `${callLink}${callLink.includes("?") ? "&" : "?"}returnTo=${encodeURIComponent(studentDashboardPath)}`
        : "";

      return {
        id: appointment.id,
        checked: appointment.status === "approved",
        lesson: appointment.lesson,
        teacher: appointment.teacherName || appointment.teacherId || "N/A",
        price: appointment.price,
        isPast,
        videoCall: canJoin ? (
          <Button
            as="button"
            onClick={() => openCallTab(videoCallHref)}
            variant="link"
            className="text-white underline text-[14px] md:text-[16px] hover:text-gray-300"
          >
            Join
          </Button>
        ) : isPast ? (
          "Past"
        ) : (
          "N/A"
        ),
      };
    });
  }, [appointments, today, isPastAppointment, studentDashboardPath]);

  return (
    <div>
      <PageTitle title="General" />
      <div className="flex flex-col items-center justify-center mt-6 lg:flex-row lg:justify-between gap-10">
        <FindTeachersCard />
        <Calendar />
      </div>
      <PageTitle title="My lessons today" />
      <div className="mt-7">
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
            No approved lessons scheduled for today
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
