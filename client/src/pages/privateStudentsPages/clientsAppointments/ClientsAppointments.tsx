import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import LessonsTable from "../../../components/table/LessonsTable";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { useLocation } from "react-router-dom";
import { useStudentAppointmentsQuery } from "../../../features/appointments/query/useAppointmentsQuery";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { useDeleteAppointmentMutation } from "../../../features/appointments/mutations/useDeleteAppointmentMutation";
import { AppointmentStatus } from "../../../types/appointments.types";
import { LessonRowData } from "../../../components/table/LessonRow";
import { useModalStore } from "../../../store/modals.store";

export const ClientsAppointments = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;
  const { pathname } = useLocation();
  const user = useAuthSessionStore((state) => state.user);
  const accountType = useAuthSessionStore((s) => s.accountType ?? s.user?.role);

  const { open: openModal } = useModalStore();

  const inferredType =
    accountType ?? (pathname.startsWith("/teacher") ? "teacher" : "student");

  const isTeacher = inferredType === "teacher";

  const {
    data: studentData,
    isLoading: isStudentLoading,
    error: studentError,
  } = useStudentAppointmentsQuery(isTeacher ? "" : user?.id || "", page, limit);

  const studentAppointments = studentData?.appointments || [];
  const studentTotalPages = studentData?.totalPages || 1;

  const {
    data: teacherData,
    isLoading: isTeacherLoading,
    error: teacherError,
  } = useTeacherAppointmentsQuery(undefined, page, limit);

  const teacherAppointments = teacherData?.appointments || [];
  const teacherTotalPages = teacherData?.totalPages || 1;

  const updateAppointmentMutation = useUpdateAppointmentMutation();
  const deleteAppointmentMutation = useDeleteAppointmentMutation();

  const appointments = isTeacher ? teacherAppointments : studentAppointments;
  const totalPages = isTeacher ? teacherTotalPages : studentTotalPages;
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

  const handleDelete = (appointmentId: string) => {
    openModal("confirmDelete", {
      title: "Delete Appointment",
      message: "Are you sure you want to delete this appointment?",
      onConfirm: () => {
        deleteAppointmentMutation.mutate(appointmentId);
      },
    });
  };

  const isPastAppointment = (date: string, time: string): boolean => {
    if (!date || !time) {
      return false;
    }

    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }

    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    return appointmentDateTime < now;
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    const selectedAppointments = appointments.filter((apt) =>
      selectedIds.includes(apt.id),
    );

    const futureAppointments = selectedAppointments.filter(
      (apt) => !isPastAppointment(apt.date, apt.time),
    );

    if (futureAppointments.length > 0) {
      openModal("alert", {
        title: "Cannot Delete",
        message: "You cannot delete future lesson",
      });
      return;
    }

    openModal("confirmDelete", {
      title: "Delete Appointments",
      message: `Are you sure you want to delete ${selectedIds.length} appointment(s)?`,
      onConfirm: async () => {
        const deletePromises = selectedIds.map((id) =>
          deleteAppointmentMutation.mutateAsync(id),
        );

        const results = await Promise.allSettled(deletePromises);

        const failures = results.filter(
          (result) => result.status === "rejected",
        );

        if (failures.length === 0) {
          setSelectedIds([]);
        } else {
          openModal("alert", {
            title: "Delete Failed",
            message: `Failed to delete ${failures.length} appointment(s). Please try again.`,
          });
        }
      },
    });
  };

  const tableRows = appointments
    .filter((appointment) => appointment.date && appointment.time)
    .map((appointment) => ({
      id: appointment.id,
      checked: false,
      lesson: appointment.lesson,
      student: appointment.studentName || appointment.studentId,
      teacher: appointment.teacherName || appointment.teacherId,
      price: appointment.price,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      onStatusChange: isTeacher
        ? (newStatus: AppointmentStatus) =>
            handleStatusChange(appointment.id, newStatus)
        : undefined,
      canDelete: isPastAppointment(appointment.date, appointment.time),
      onDelete: isPastAppointment(appointment.date, appointment.time)
        ? () => handleDelete(appointment.id)
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
              onSelectionChange={setSelectedIds}
              onBulkDelete={handleBulkDelete}
              isPastAppointment={isPastAppointment}
            />
          )}

          <div className="mt-auto pt-4 mb-6 flex justify-center">
            <Pagination
              activeIndex={page}
              onIndexChange={setPage}
              totalPages={totalPages}
              theme="secondary"
              shape="square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
