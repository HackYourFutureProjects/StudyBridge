import { useMemo } from "react";
import LessonsTable from "../table/LessonsTable";
import { Calendar } from "../calendar/Calendar";
import { PageTitle } from "../pageTitle/PageTitle";
import { NumberOfStudentsCard } from "./NumberOfStudentsCard";
import { useTeacherAppointmentsQuery } from "../../features/appointments/query/useTeacherAppointmentsQuery";
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
  const { isPastAppointment } = useAppointmentTime();
  const { confirmStartCall } = useVideoCall();
  const teacherDashboardPath = joinPath(
    teacherBase,
    teacherPrivatesRoutesVariables.dashboard,
  );

  const today = new Date().toISOString().split("T")[0];

  const rows = useMemo(() => {
    const appointments = data?.appointments ?? [];
    return appointments
      .filter((appointment) => appointment.date === today)
      .map((appointment) => {
        const isPast = isPastAppointment(appointment.date, appointment.time);

        return {
          id: appointment.id,
          checked: appointment.status === "approved",
          lesson: appointment.lesson,
          student: appointment.studentName || appointment.studentId || "N/A",
          price: appointment.price,
          isPast,
          videoCall: (
            <Button
              as="button"
              variant="link"
              className="text-white underline text-[14px] md:text-[16px] hover:text-gray-300"
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
  }, [data, isPastAppointment, confirmStartCall, today]);

  return (
    <div>
      <PageTitle title="General" />
      <div className="mt-6 flex flex-col items-center justify-center gap-[40px] lg:flex-row lg:justify-between">
        <NumberOfStudentsCard count={789} />
        <Calendar />
      </div>

      <PageTitle title="My lessons today" />
      <div className="mt-[28px]">
        {isLoading ? (
          <div className="py-8 text-center text-white">Loading lessons...</div>
        ) : error ? (
          <div className="py-8 text-center text-white">
            Error loading lessons
          </div>
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-white">
            No lessons scheduled for today
          </div>
        ) : (
          <LessonsTable
            height={290}
            columns={[
              { key: "lesson", label: "Lessons", width: "130px" },
              { key: "student", label: "Students", width: "184px" },
              { key: "price", label: "Price", width: "146px" },
              { key: "videoCall", label: "Video call", width: "146px" },
            ]}
            rows={rows}
          />
        )}
      </div>
    </div>
  );
};
