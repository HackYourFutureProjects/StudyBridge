import { useMemo } from "react";
import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../pageTitle/PageTitle";
import { NumberOfStudentsCard } from "./NumberOfStudentsCard";
import { RequestStudentsCard } from "./RequestStudentsCard";
import { LessonCard } from "./LessonCard";
import { useTeacherAppointmentsQuery } from "../../features/appointments/query/useTeacherAppointmentsQuery";
import { useRegularStudentsQuery } from "../../features/appointments/query/useRegularStudentsQuery";
import { useAppointmentTime } from "../../features/appointments/hooks/useAppointmentTime";
import { useVideoCall } from "../../features/appointments/hooks/useVideoCall";
import { Button } from "../ui/button/Button";
import {
  teacherBase,
  teacherPrivatesRoutesVariables,
} from "../../router/routesVariables/pathVariables";
import { joinPath } from "../../util/joinPath.util";

export const MyLessonsSection = () => {
  const { data, isLoading, error } = useTeacherAppointmentsQuery();
  const { data: regularStudentsData } = useRegularStudentsQuery();
  const { isPastAppointment } = useAppointmentTime();
  const { confirmStartCall } = useVideoCall();
  const teacherDashboardPath = joinPath(
    teacherBase,
    teacherPrivatesRoutesVariables.dashboard,
  );

  const regularStudentsCount = regularStudentsData?.total || 0;

  const requestStudentsCount = useMemo(() => {
    const appointments = data?.appointments ?? [];
    return appointments.filter(
      (appointment) =>
        appointment.status === "approved" || appointment.status === "pending",
    ).length;
  }, [data]);

  const today = new Date().toISOString().split("T")[0];

  const lessons = useMemo(() => {
    const appointments = data?.appointments ?? [];
    return appointments
      .filter((appointment) => appointment.date === today)
      .map((appointment) => {
        const isPast = isPastAppointment(appointment.date, appointment.time);

        return {
          id: appointment.id,
          lesson: appointment.lesson,
          student: appointment.studentName || appointment.studentId || "N/A",
          price: appointment.price,
          date: appointment.date,
          time: appointment.time,
          isPast,
          videoCall: (
            <Button
              as="button"
              variant="link"
              className="text-blue-400 underline text-[12px] hover:text-blue-300 transition-colors"
              onClick={() =>
                confirmStartCall(
                  appointment.studentId,
                  appointment.id,
                  teacherDashboardPath,
                )
              }
            >
              Start call!
            </Button>
          ),
        };
      });
  }, [data, isPastAppointment, confirmStartCall, today, teacherDashboardPath]);

  return (
    <div>
      <PageTitle title="General" />
      <div className="mt-6 flex flex-col items-center justify-center gap-[24px] lg:flex-row lg:justify-between lg:gap-[40px]">
        <NumberOfStudentsCard count={regularStudentsCount} />
        <RequestStudentsCard count={requestStudentsCount} />
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
            No lessons scheduled for today
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson.lesson}
                student={lesson.student}
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
