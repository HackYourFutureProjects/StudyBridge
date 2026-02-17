import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import LessonsTable from "../../../components/table/LessonsTable";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { AppointmentStatus } from "../../../types/appointments.types";
import { LessonRowData } from "../../../components/table/LessonRow";

export const TeacherAppointments = () => {
  const [page, setPage] = useState(1);

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useTeacherAppointmentsQuery();
  const updateAppointmentMutation = useUpdateAppointmentMutation();

  const columns = [
    { key: "lesson", label: "Lessons", width: "130px" },
    { key: "student", label: "Students", width: "184px" },
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
    price: appointment.price,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    onStatusChange: (newStatus: AppointmentStatus) =>
      handleStatusChange(appointment.id, newStatus),
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

          <LessonsTable
            width={1200}
            headerHeight={66}
            rowHeight={66}
            columns={columns}
            useStatusButtons={true}
            rows={tableRows}
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
