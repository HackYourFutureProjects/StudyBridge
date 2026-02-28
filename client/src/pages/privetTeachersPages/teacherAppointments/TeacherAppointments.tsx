import { useState } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../../features/appointments/mutations/useUpdateAppointmentMutation";
import { useDeleteAppointmentMutation } from "../../../features/appointments/mutations/useDeleteAppointmentMutation";
import {
  Appointment,
  AppointmentStatus,
} from "../../../types/appointments.types";
import { useModalStore } from "../../../store/modals.store";
import { useVideoCall } from "../../../features/appointments/hooks/useVideoCall";
import { useAppointmentTime } from "../../../features/appointments/hooks/useAppointmentTime";
import { TeacherAppointmentsList } from "../../../components/teacherAppointmentCard/TeacherAppointmentsList";
import { LessonSchedule } from "../../../components/teacherProfileSection/LessonSchedule";
import {
  getMyWeeklyScheduleApi,
  updateMyWeeklyScheduleApi,
} from "../../../api/teacher/teacher.api";
import {
  mapUiSlotsToMergedWeekAvailability,
  mapWeekAvailabilityToUiSlots,
} from "../teacherProfile/scheduleMappers";
import { mapAppointmentsToBookedSlots } from "../../../util/appointmentSchedule.util";

export interface TimeSlot {
  day: string;
  hour: number;
}

const REGULAR_STUDENTS_KEY = "regularStudents";

const getInitialRegularStudents = (): Appointment[] => {
  try {
    const stored = localStorage.getItem(REGULAR_STUDENTS_KEY);
    if (!stored) return [];

    const students: Appointment[] = JSON.parse(stored);
    let needsUpdate = false;

    const migratedStudents = students.map((student) => {
      if (!student.addedToRegularAt) {
        needsUpdate = true;
        return {
          ...student,
          addedToRegularAt: new Date(student.date).toISOString(),
        };
      }
      return student;
    });

    if (needsUpdate) {
      localStorage.setItem(
        REGULAR_STUDENTS_KEY,
        JSON.stringify(migratedStudents),
      );
    }

    return migratedStudents;
  } catch {
    return [];
  }
};

export const TeacherAppointments = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "regular">(
    "requests",
  );
  const [page, setPage] = useState(1);
  const [regularPage, setRegularPage] = useState(1);
  const limit = 5;
  const regularLimit = 5;
  const [regularStudents, setRegularStudents] = useState<Appointment[]>(
    getInitialRegularStudents,
  );
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);

  const { open: openModal } = useModalStore();
  const { confirmStartCall } = useVideoCall();
  const { isPastAppointment } = useAppointmentTime();

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
    const isAlreadyAdded = regularStudents.some(
      (student) => student.id === appointment.id,
    );
    if (!isAlreadyAdded) {
      const appointmentWithTimestamp = {
        ...appointment,
        addedToRegularAt: new Date().toISOString(),
      };
      const updated = [...regularStudents, appointmentWithTimestamp];
      setRegularStudents(updated);
      localStorage.setItem(REGULAR_STUDENTS_KEY, JSON.stringify(updated));
    }
  };

  const handleRemoveFromRegular = (appointmentId: string) => {
    openModal("confirmDelete", {
      title: "Remove from Regular Students",
      message:
        "Are you sure you want to remove this student from regular students?",
      onConfirm: () => {
        const updated = regularStudents.filter(
          (student) => student.id !== appointmentId,
        );
        setRegularStudents(updated);
        localStorage.setItem(REGULAR_STUDENTS_KEY, JSON.stringify(updated));
      },
    });
  };

  const handleOpenSchedule = async () => {
    try {
      const availability = await getMyWeeklyScheduleApi();
      setSchedule(mapWeekAvailabilityToUiSlots(availability));
    } catch (error) {
      console.error("Failed to load weekly availability", error);
    } finally {
      setIsScheduleOpen(true);
    }
  };

  const handleScheduleSave = async (slots: TimeSlot[]) => {
    try {
      setSchedule(slots);
      const availability = mapUiSlotsToMergedWeekAvailability(slots);
      await updateMyWeeklyScheduleApi({ availability });
      openModal("alert", {
        title: "Success",
        message: "Schedule saved successfully",
      });
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { errorsMessages?: Array<{ message: string }> } };
      };
      openModal("alert", {
        title: "Error",
        message:
          axiosError?.response?.data?.errorsMessages?.[0]?.message ||
          "Failed to save schedule. Please try again.",
      });
    }
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

  const getSortedRegularStudents = () => {
    return [...regularStudents].sort((a, b) => {
      const dateA = new Date(a.addedToRegularAt || a.date).getTime();
      const dateB = new Date(b.addedToRegularAt || b.date).getTime();
      return dateB - dateA;
    });
  };

  const getPaginatedRegularStudents = () => {
    const sorted = getSortedRegularStudents();
    const startIndex = (regularPage - 1) * regularLimit;
    const endIndex = startIndex + regularLimit;
    return sorted.slice(startIndex, endIndex);
  };

  const regularTotalPages = Math.ceil(regularStudents.length / regularLimit);

  const getBookedSlots = () => {
    const allAppointments = data?.appointments || [];
    return mapAppointmentsToBookedSlots(allAppointments);
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
              regularStudentIds={regularStudents.map((student) => student.id)}
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
            {regularStudents.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-400 mb-4">No regular students yet</p>
                <p className="text-sm text-gray-500">
                  Add approved appointments to your regular students list
                </p>
              </div>
            ) : (
              <>
                <TeacherAppointmentsList
                  appointments={getPaginatedRegularStudents()}
                  isPastAppointment={isPastAppointment}
                  onStatusChange={handleStatusChange}
                  onStartCall={confirmStartCall}
                  onDelete={handleRemoveFromRegular}
                  onRemoveFromRegular={handleRemoveFromRegular}
                  onScheduleClick={handleOpenSchedule}
                  isRegularTab
                />

                {regularTotalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      activeIndex={regularPage}
                      onIndexChange={setRegularPage}
                      totalPages={regularTotalPages}
                      theme="secondary"
                      shape="square"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <LessonSchedule
        key={JSON.stringify(schedule)}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleScheduleSave}
        initialSlots={schedule}
        bookedSlots={getBookedSlots()}
      />
    </div>
  );
};
