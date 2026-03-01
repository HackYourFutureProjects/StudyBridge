import { useState, useEffect } from "react";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { useStudentAppointmentsQuery } from "../../../features/appointments/query/useAppointmentsQuery";
import { useDeleteAppointmentMutation } from "../../../features/appointments/mutations/useDeleteAppointmentMutation";
import { AppointmentCard } from "../../../components/appointmentCard/AppointmentCard";
import { getTeacherByIdApi } from "../../../api/teacher/teacher.api";
import { TeacherType } from "../../../api/teacher/teacher.type";
import { useAppointmentTime } from "../../../features/appointments/hooks/useAppointmentTime";
import { useModalStore } from "../../../store/modals.store";
import { useRegularTeachersQuery } from "../../../features/appointments/query/useRegularTeachersQuery";
import { ViewScheduleModal } from "../../../components/regularStudentScheduleModal/ViewScheduleModal";
import { Appointment } from "../../../types/appointments.types";

export const ClientsAppointments = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "regular">(
    "requests",
  );
  const [page, setPage] = useState(1);
  const [regularPage, setRegularPage] = useState(1);
  const [teachersData, setTeachersData] = useState<Record<string, TeacherType>>(
    {},
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Appointment | null>(
    null,
  );
  const limit = 5;
  const regularLimit = 5;
  const user = useAuthSessionStore((state) => state.user);
  const { isPastAppointment } = useAppointmentTime();
  const { open: openModal } = useModalStore();

  const {
    data: studentData,
    isLoading,
    error,
  } = useStudentAppointmentsQuery(user?.id || "", page, limit);

  const { data: regularTeachersData } = useRegularTeachersQuery(
    regularPage,
    regularLimit,
  );

  const deleteAppointmentMutation = useDeleteAppointmentMutation();

  const appointments = studentData?.appointments || [];
  const totalPages = studentData?.totalPages || 1;
  const regularTeachers = regularTeachersData?.appointments || [];
  const regularTotalPages = regularTeachersData?.totalPages || 1;

  useEffect(() => {
    const fetchTeachersData = async () => {
      const teacherIds = [...new Set(appointments.map((apt) => apt.teacherId))];
      const newTeachersData: Record<string, TeacherType> = {};

      await Promise.all(
        teacherIds.map(async (teacherId) => {
          if (!teachersData[teacherId]) {
            try {
              const teacher = await getTeacherByIdApi(teacherId);
              newTeachersData[teacherId] = teacher;
            } catch {
              // Silent fail
            }
          }
        }),
      );

      if (Object.keys(newTeachersData).length > 0) {
        setTeachersData((prev) => ({ ...prev, ...newTeachersData }));
      }
    };

    if (appointments.length > 0) {
      fetchTeachersData();
    }
  }, [appointments]);

  const handleDelete = (appointmentId: string) => {
    openModal("confirmDelete", {
      title: "Delete Appointment",
      message: "Are you sure you want to delete this appointment?",
      onConfirm: () => {
        deleteAppointmentMutation.mutate(appointmentId);
      },
    });
  };

  const handleShowSchedule = (appointment: Appointment) => {
    setSelectedTeacher(appointment);
    setIsScheduleModalOpen(true);
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
            Regular Teachers
          </button>
        </div>

        {activeTab === "requests" ? (
          <div className="mt-4 md:mt-6">
            {appointments.length === 0 ? (
              <div className="text-white text-center py-8">
                No appointments found
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((appointment) => {
                  const isPast = isPastAppointment(
                    appointment.date,
                    appointment.time,
                  );

                  return (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      teacherAvatar={
                        teachersData[appointment.teacherId]?.profileImageUrl
                      }
                      isPast={isPast}
                      onDelete={
                        isPast ? () => handleDelete(appointment.id) : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

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
            {regularTeachers.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-400 mb-4">No regular teachers yet</p>
                <p className="text-sm text-gray-500">
                  Your regular teachers will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {regularTeachers.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      teacherAvatar={
                        teachersData[appointment.teacherId]?.profileImageUrl
                      }
                      isPast={false}
                      isRegularTeacher={true}
                      onShowSchedule={() => handleShowSchedule(appointment)}
                    />
                  ))}
                </div>

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

      <ViewScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedTeacher(null);
        }}
        teacherName={selectedTeacher?.teacherName || "Unknown Teacher"}
        schedule={selectedTeacher?.weeklySchedule || []}
      />
    </div>
  );
};
