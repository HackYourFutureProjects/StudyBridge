import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../pageTitle/PageTitle";
import { MyLessonsCard } from "./MyLessonsCard";
import { MyTeachersCard } from "./MyTeachersCard";
import { StudentLessonCard } from "./StudentLessonCard";
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
  const totalLessonsCount = appointments.length;

  const uniqueTeachersCount = useMemo(() => {
    const teacherIds = new Set();
    appointments.forEach((appointment) => {
      if (appointment.teacherId) {
        teacherIds.add(appointment.teacherId);
      }
    });
    return teacherIds.size;
  }, [appointments]);

  const today = new Date().toISOString().split("T")[0];

  const openCallTab = (url: string) => {
    const opened = window.open(url, "_blank");
    if (!opened) {
      window.location.href = url;
    }
  };

  const lessons = useMemo(() => {
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
        lesson: appointment.lesson,
        teacher: appointment.teacherName || appointment.teacherId || "N/A",
        price: appointment.price,
        date: appointment.date,
        time: appointment.time,
        isPast,
        videoCall: canJoin ? (
          <Button
            as="button"
            onClick={() => openCallTab(videoCallHref)}
            variant="link"
            className="text-blue-400 underline text-[12px] hover:text-blue-300 transition-colors"
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
      <div className="mt-6 flex flex-col items-center justify-center gap-[24px] lg:flex-row lg:justify-between lg:gap-[40px]">
        <MyLessonsCard count={totalLessonsCount} />
        <MyTeachersCard count={uniqueTeachersCount} />
        <Calendar />
      </div>

      <PageTitle title="My lessons today" />
      <div className="mt-[12px]">
        {isLoading ? (
          <div className="py-8 text-center text-white">Loading lessons...</div>
        ) : error ? (
          <div className="py-8 text-center text-white">
            Error loading lessons
          </div>
        ) : lessons.length === 0 ? (
          <div className="py-8 text-center text-white">
            No approved lessons scheduled for today
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {lessons.map((lesson) => (
              <StudentLessonCard
                key={lesson.id}
                lesson={lesson.lesson}
                teacher={lesson.teacher}
                price={lesson.price}
                date={lesson.date}
                time={lesson.time}
                isPast={lesson.isPast}
                videoCall={lesson.videoCall}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
