import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import LessonsTable from "../../../components/table/LessonsTable";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { useDeleteAppointmentMutation } from "../../../features/appointments/mutations/useDeleteAppointmentMutation";
import { AppointmentStatus } from "../../../types/appointments.types";
import { LessonRowData } from "../../../components/table/LessonRow";
import { useModalStore } from "../../../store/modals.store";
import { Button } from "../../../components/ui/button/Button";
import { startCall } from "../../../api/video/video.api";
import { useAuthSessionStore } from "../../../store/authSession.store";

export const TeacherAppointments = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "regular">(
    "requests",
  );
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const limit = 10;
  const user = useAuthSessionStore((state) => state.user);

  const { open: openModal } = useModalStore();

  const { data, isLoading, error } = useTeacherAppointmentsQuery(
    undefined,
    page,
    limit,
  );

  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  const updateAppointmentMutation = useUpdateAppointmentMutation();
  const deleteAppointmentMutation = useDeleteAppointmentMutation();

  const columns = [
    { key: "lesson", label: "Lessons", width: "130px" },
    { key: "student", label: "Students", width: "184px" },
    { key: "price", label: "Price", width: "146px" },
    { key: "date", label: "Date", width: "146px" },
    { key: "time", label: "Time", width: "146px" },
    { key: "videoCall", label: "Video call", width: "146px" },
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

  const confirmStartCall = (studentId: string, appointmentId?: string) => {
    openModal("confirmDelete", {
      title: "Start Video Call",
      message: "Do you want to start this call now?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      confirmVariant: "primary",
      onConfirm: () => {
        void handleStartCall(studentId, appointmentId);
      },
    });
  };

  const handleStartCall = async (studentId: string, appointmentId?: string) => {
    if (!user?.id) return;

    const callWindow = window.open("about:blank", "_blank");
    if (!callWindow) {
      openModal("alert", {
        title: "Popup blocked",
        message: "Please allow popups for this site, then try again.",
      });
      return;
    }

    try {
      const call = await startCall({
        teacherId: user.id,
        studentId,
        appointmentId: appointmentId ?? undefined,
        streamCallId: `call_${crypto.randomUUID()}`,
      });

      const callUrl = `/call/${call.id}?streamCallId=${encodeURIComponent(
        call.streamCallId,
      )}&streamCallType=${encodeURIComponent(call.streamCallType)}`;

      callWindow.location.href = callUrl;
    } catch (error) {
      callWindow.close();
      console.error("Failed to start call", error);
    }
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
    .map((appointment) => {
      const isPast = isPastAppointment(appointment.date, appointment.time);
      return {
        id: appointment.id,
        checked: false,
        lesson: appointment.lesson,
        student: appointment.studentName || appointment.studentId,
        price: appointment.price,
        date: appointment.date,
        time: appointment.time,
        videoCall: (
          <Button
            as="button"
            variant="link"
            className="text-inherit underline font-normal min-h-0 min-w-0 rounded-none"
            onClick={() =>
              confirmStartCall(appointment.studentId, appointment.id)
            }
          >
            Start call!
          </Button>
        ),
        status: appointment.status,
        isPast: isPast,
        onStatusChange: !isPast
          ? (newStatus: AppointmentStatus) =>
              handleStatusChange(appointment.id, newStatus)
          : undefined,
        canDelete: isPast,
        onDelete: isPast ? () => handleDelete(appointment.id) : undefined,
      };
    }) as LessonRowData[];

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
    <div className="px-6 lg:px-10 flex flex-col">
      <div className="pt-10 flex flex-col flex-1">
        <PageTitle title="My Appointments" />

        <div className="mt-6" />
        <div className="mt-6 flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "requests"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("regular")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "regular"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Regular Students
          </button>
        </div>

        {activeTab === "requests" ? (
          <>
            <div className="mt-6" />

            <LessonsTable
              headerHeight={66}
              rowHeight={66}
              columns={columns}
              useStatusButtons={true}
              rows={tableRows}
              onSelectionChange={setSelectedIds}
              onBulkDelete={handleBulkDelete}
              isPastAppointment={isPastAppointment}
            />

            <div className="mt-auto pt-4 mb-6 flex justify-center">
              <Pagination
                activeIndex={page}
                onIndexChange={setPage}
                totalPages={totalPages}
                theme="secondary"
                shape="square"
              />
            </div>
          </>
        ) : (
          <div className="mt-6 text-white">
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                Regular students feature coming soon
              </p>
              <p className="text-sm text-gray-500">
                Here you&apos;ll be able to manage recurring lessons with your
                regular students
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
