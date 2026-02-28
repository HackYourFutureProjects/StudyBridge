import { Appointment, AppointmentStatus } from "../../types/appointments.types";
import { TeacherAppointmentCard } from "./TeacherAppointmentCard";

type TeacherAppointmentsListProps = {
  appointments: Appointment[];
  isPastAppointment: (date: string, time: string) => boolean;
  onStatusChange: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onStartCall: (studentId: string, appointmentId: string) => void;
  onDelete: (appointmentId: string) => void;
};

export const TeacherAppointmentsList = ({
  appointments,
  isPastAppointment,
  onStatusChange,
  onStartCall,
  onDelete,
}: TeacherAppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-white text-center py-8">No appointments found</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {appointments.map((appointment) => {
        const isPast = isPastAppointment(appointment.date, appointment.time);

        return (
          <TeacherAppointmentCard
            key={appointment.id}
            appointment={appointment}
            studentAvatar={null}
            isPast={isPast}
            onStatusChange={
              !isPast
                ? (newStatus: AppointmentStatus) =>
                    onStatusChange(appointment.id, newStatus)
                : undefined
            }
            onStartCall={() =>
              onStartCall(appointment.studentId, appointment.id)
            }
            onDelete={isPast ? () => onDelete(appointment.id) : undefined}
          />
        );
      })}
    </div>
  );
};
