import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import LessonsTable from "../../../components/table/LessonsTable";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { useLocation } from "react-router-dom";
import { useStudentAppointmentsQuery } from "../../../features/appointments/query/useAppointmentsQuery";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { AppointmentStatus } from "../../../types/appointments.types";
import { LessonRowData } from "../../../components/table/LessonRow";

export const ClientsAppointments = () => {
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();
  const user = useAuthSessionStore((state) => state.user);
  const accountType = useAuthSessionStore((s) => s.accountType ?? s.user?.role);

  const inferredType =
    accountType ?? (pathname.startsWith("/teacher") ? "teacher" : "student");

  const isTeacher = inferredType === "teacher";

  const {
    data: studentAppointments = [],
    isLoading: isStudentLoading,
    error: studentError,
  } = useStudentAppointmentsQuery(isTeacher ? "" : user?.id || "");

  const {
    data: teacherAppointments = [],
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useTeacherAppointmentsQuery();

  const updateAppointmentMutation = useUpdateAppointmentMutation();

  const appointments = isTeacher ? teacherAppointments : studentAppointments;
  const isLoading = isTeacher ? isTeacherLoading : isStudentLoading;
  const error = isTeacher ? teacherError : studentError;

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

  const handleStatusChange = (
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) => {
    updateAppointmentMutation.mutate({
      appointmentId,
      status: newStatus,
    });
  };

  const tableRows = appointments.map((appointment) => ({
    id: appointment.id,
    checked: false,
    lesson: appointment.lesson,
    student: appointment.student,
    teacher: appointment.teacher,
    price: appointment.price,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    onStatusChange: isTeacher
      ? (newStatus: AppointmentStatus) =>
          handleStatusChange(appointment.id, newStatus)
      : undefined,
  })) as LessonRowData[];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-10 min-h-screen flex flex-col">
          <div className="pt-[40px] flex flex-col flex-1">
            <div className="text-white text-center">
              Loading appointments...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-10 min-h-screen flex flex-col">
          <div className="pt-[40px] flex flex-col flex-1">
            <div className="text-white text-center">
              Error loading appointments
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <div className="pt-[40px] flex flex-col flex-1">
          <PageTitle title="My Appointments" />
          <div className="mt-6" />

          {appointments.length === 0 ? (
            <div className="text-white text-center py-8">
              No appointments found
            </div>
          ) : (
            <LessonsTable
              headerHeight={66}
              rowHeight={66}
              columns={columns}
              useStatusButtons={isTeacher}
              rows={tableRows}
            />
          )}

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
