import { Appointment, AppointmentStatus } from "../../types/appointments.types";
import { TeacherAppointmentStatusBar } from "./TeacherAppointmentStatusBar.tsx";
import { TeacherAppointmentAvatar } from "./TeacherAppointmentAvatar.tsx";
import { TeacherAppointmentInfo } from "./TeacherAppointmentInfo.tsx";
import { TeacherAppointmentActions } from "./TeacherAppointmentActions.tsx";
import { getStatusStyles } from "../appointmentCard/appointmentCard.utils";

type TeacherAppointmentCardProps = {
  appointment: Appointment;
  studentAvatar?: string | null;
  isPast?: boolean;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  onStartCall: () => void;
  onDelete?: () => void;
  onAddToRegular?: () => void;
  onRemoveFromRegular?: () => void;
  isRegularTab?: boolean;
  onScheduleClick?: () => void;
};

export const TeacherAppointmentCard = ({
  appointment,
  studentAvatar,
  isPast = false,
  onStatusChange,
  onStartCall,
  onDelete,
  onAddToRegular,
  onRemoveFromRegular,
  isRegularTab = false,
  onScheduleClick,
}: TeacherAppointmentCardProps) => {
  const statusStyles = getStatusStyles(appointment.status);

  return (
    <div
      className={`relative flex flex-col border rounded-[25px] overflow-hidden ${
        isPast ? "opacity-50" : ""
      } ${statusStyles.borderCard}`}
      style={{
        backgroundColor: statusStyles.bgCard,
      }}
    >
      <TeacherAppointmentStatusBar
        date={appointment.date}
        time={appointment.time}
        statusStyles={statusStyles}
        showScheduleButton={isRegularTab}
        onScheduleClick={onScheduleClick}
      />

      <div className="flex items-center px-6 py-6 gap-6">
        <TeacherAppointmentAvatar
          studentAvatar={studentAvatar}
          studentName={appointment.studentName}
        />

        <TeacherAppointmentInfo
          lesson={appointment.lesson}
          studentName={appointment.studentName}
          price={appointment.price}
        />

        <TeacherAppointmentActions
          status={appointment.status}
          isPast={isPast}
          onStatusChange={onStatusChange}
          onStartCall={onStartCall}
          onDelete={onDelete}
          onAddToRegular={onAddToRegular}
          onRemoveFromRegular={onRemoveFromRegular}
          isRegularTab={isRegularTab}
        />
      </div>
    </div>
  );
};
