import { Appointment } from "../../types/appointments.types";
import { AppointmentStatusBar } from "./AppointmentStatusBar";
import { AppointmentAvatar } from "./AppointmentAvatar";
import { AppointmentInfo } from "./AppointmentInfo";
import { AppointmentJoinButton } from "./AppointmentJoinButton";
import {
  getStatusStyles,
  isInternalVideoCallLink,
} from "./appointmentCard.utils";

export type AppointmentCardProps = {
  appointment: Appointment;
  teacherAvatar?: string | null;
  isPast?: boolean;
  onDelete?: () => void;
  isRegularTeacher?: boolean;
  onShowSchedule?: () => void;
};

export const AppointmentCard = ({
  appointment,
  teacherAvatar,
  isPast = false,
  onDelete,
  isRegularTeacher = false,
  onShowSchedule,
}: AppointmentCardProps) => {
  const statusStyles = getStatusStyles(appointment.status);
  const isInternalLink = isInternalVideoCallLink(appointment.videoCall);
  const canJoin = !isPast && isInternalLink && appointment.videoCall;

  return (
    <div
      className={`relative flex flex-col border rounded-[15px] md:rounded-[20px] lg:rounded-[25px] overflow-hidden ${
        isPast ? "opacity-50" : ""
      } ${isRegularTeacher ? "border-purple-500" : statusStyles.borderCard}`}
      style={{
        backgroundColor: isRegularTeacher ? "#1E1D28" : statusStyles.bgCard,
      }}
    >
      <AppointmentStatusBar
        date={appointment.date}
        time={appointment.time}
        statusStyles={statusStyles}
        isRegularStudent={appointment.isRegularStudent}
        isRegularTeacher={isRegularTeacher}
        onShowSchedule={onShowSchedule}
      />

      <div className="flex flex-col min-[480px]:flex-row items-center min-[480px]:items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 gap-3 sm:gap-4 md:gap-6">
        <AppointmentAvatar
          teacherAvatar={teacherAvatar}
          teacherName={appointment.teacherName}
        />

        <AppointmentInfo
          lesson={appointment.lesson}
          teacherName={appointment.teacherName}
          price={appointment.price}
          weeklySchedule={appointment.weeklySchedule}
          isRegularTeacher={isRegularTeacher}
        />

        <AppointmentJoinButton
          canJoin={!!canJoin}
          videoCall={appointment.videoCall}
          isPast={isPast}
          onDelete={isPast ? onDelete : undefined}
        />
      </div>
    </div>
  );
};
