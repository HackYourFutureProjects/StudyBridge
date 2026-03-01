import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { useDeleteAppointmentMutation } from "../../../features/appointments/mutations/useDeleteAppointmentMutation";
import {
  Appointment,
  AppointmentStatus,
  WeeklyScheduleSlot,
} from "../../../types/appointments.types";
import { useModalStore } from "../../../store/modals.store";
import { useVideoCall } from "../../../features/appointments/hooks/useVideoCall";
import { useAppointmentTime } from "../../../features/appointments/hooks/useAppointmentTime";
import { TeacherAppointmentsList } from "../../../components/teacherAppointmentCard/TeacherAppointmentsList";
import { LessonSchedule } from "../../../components/teacherProfileSection/LessonSchedule";
import { RegularStudentScheduleModal } from "../../../components/regularStudentScheduleModal/RegularStudentScheduleModal";
import { useSetRegularStudentMutation } from "../../../features/appointments/mutations/useSetRegularStudentMutation";
import { useUpdateWeeklyScheduleMutation } from "../../../features/appointments/mutations/useUpdateWeeklyScheduleMutation";
import { useRemoveRegularStudentMutation } from "../../../features/appointments/mutations/useRemoveRegularStudentMutation";
import { useRegularStudentsQuery } from "../../../features/appointments/query/useRegularStudentsQuery";

export interface TimeSlot {
  day: string;
  hour: number;
}

export const TeacherAppointments = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "regular">(
    "requests",
  );
  const [page, setPage] = useState(1);
  const limit = 5;
  const [isRegularStudentModalOpen, setIsRegularStudentModalOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Appointment | null>(
    null,
  );

  const { open: openModal } = useModalStore();
  const { confirmStartCall } = useVideoCall();
  const { isPastAppointment } = useAppointmentTime();
  const setRegularStudentMutation = useSetRegularStudentMutation();
  const updateWeeklyScheduleMutation = useUpdateWeeklyScheduleMutation();
  const removeRegularStudentMutation = useRemoveRegularStudentMutation();
  const { data: regularStudentsData } = useRegularStudentsQuery();

  const { data, isLoading, error } = useTeacherAppointmentsQuery(
    undefined,
    page,
    limit,
  );

  const appointments = data?.appointments || [];
  const totalPages = data?.totalPages || 1;

  const updateAppointmentMutation = useUpdateAppointmentMutation();
  const deleteAppointmentMutation = useDeleteAppointmentMutation();

  const handleAddToRegular = (appointment: Appointment) => {
    setRegularStudentMutation.mutate(appointment.id);
  };

  const handleRemoveFromRegular = (appointmentId: string) => {
    openModal("confirmDelete", {
      title: "Remove from Regular Students",
      message:
        "Are you sure you want to remove this student from regular students?",
      onConfirm: async () => {
        try {
          await removeRegularStudentMutation.mutateAsync(appointmentId);
        } catch (error) {
          console.error("Failed to remove from regular students", error);
        }
      },
    });
  };

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

  const handleUpdateStudentSchedule = async (
    schedule: WeeklyScheduleSlot[],
  ) => {
    if (!selectedStudent) return;

    try {
      await updateWeeklyScheduleMutation.mutateAsync({
        appointmentId: selectedStudent.id,
        weeklySchedule: schedule,
      });

      setIsRegularStudentModalOpen(false);
      setSelectedStudent(null);

      openModal("alert", {
        title: "Success",
        message: "Schedule updated successfully",
      });
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { errorsMessages?: Array<{ message: string }> } };
      };
      openModal("alert", {
        title: "Error",
        message:
          axiosError?.response?.data?.errorsMessages?.[0]?.message ||
          "Failed to update schedule",
      });
    }
  };

  const getBookedSlots = () => {
    const regularSlots: TimeSlot[] = [];
    regularStudentsData?.appointments?.forEach((student) => {
      if (student.weeklySchedule && Array.isArray(student.weeklySchedule)) {
        student.weeklySchedule.forEach((slot) => {
          regularSlots.push({
            day: slot.day,
            hour: slot.hour,
          });
        });
      }
    });
    return regularSlots;
  };

  const handleEditStudentSchedule = (appointment: Appointment) => {
    setSelectedStudent(appointment);
    setIsRegularStudentModalOpen(true);
  };

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
    <div className="px-4 md:px-6 lg:px-10 flex flex-col">
      <div className="pt-6 md:pt-8 lg:pt-[40px] flex flex-col">
        <PageTitle title="My Appointments" />
        <div className="mt-4 md:mt-6 flex gap-2 md:gap-4 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === "requests"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("regular")}
            className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === "regular"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Regular Students
          </button>
        </div>

        {activeTab === "requests" ? (
          <div className="mt-4 md:mt-6">
            <TeacherAppointmentsList
              appointments={appointments}
              isPastAppointment={isPastAppointment}
              onStatusChange={handleStatusChange}
              onStartCall={confirmStartCall}
              onDelete={handleDelete}
              onAddToRegular={handleAddToRegular}
              onRemoveFromRegular={handleRemoveFromRegular}
              regularStudentIds={
                regularStudentsData?.appointments?.map((apt) => apt.id) || []
              }
            />

            <div className="mt-8 flex justify-center">
              <Pagination
                activeIndex={page}
                onIndexChange={setPage}
                totalPages={totalPages}
                theme="secondary"
                shape="square"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 md:mt-6">
            {regularStudentsData?.appointments?.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-400 mb-4">No regular students yet</p>
                <p className="text-sm text-gray-500">
                  Add approved appointments to your regular students list
                </p>
              </div>
            ) : (
              <TeacherAppointmentsList
                appointments={regularStudentsData?.appointments || []}
                isPastAppointment={isPastAppointment}
                onStatusChange={handleStatusChange}
                onStartCall={confirmStartCall}
                onDelete={handleDelete}
                onRemoveFromRegular={handleRemoveFromRegular}
                onScheduleClick={handleEditStudentSchedule}
                isRegularTab
              />
            )}
          </div>
        )}
      </div>

      <LessonSchedule
        isOpen={false}
        onClose={() => {}}
        onSave={async () => {}}
        initialSlots={[]}
        bookedSlots={getBookedSlots()}
      />

      <RegularStudentScheduleModal
        isOpen={isRegularStudentModalOpen}
        onClose={() => {
          setIsRegularStudentModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleUpdateStudentSchedule}
        studentName={selectedStudent?.studentName || ""}
        initialSchedule={selectedStudent?.weeklySchedule || []}
        occupiedSlots={
          regularStudentsData?.appointments
            ?.filter((apt) => apt.id !== selectedStudent?.id)
            .flatMap((apt) => apt.weeklySchedule || []) || []
        }
      />
    </div>
  );
};
