import { Appointment } from "../../types/appointments.types";
import { AppointmentStatusBar } from "./AppointmentStatusBar";
import { AppointmentAvatar } from "./AppointmentAvatar";
import { AppointmentInfo } from "./AppointmentInfo";
import { AppointmentJoinButton } from "./AppointmentJoinButton";
import {
  getStatusStyles,
  isInternalVideoCallLink,
} from "./appointmentCard.utils";

type AppointmentCardProps = {
  appointment: Appointment;
  teacherAvatar?: string | null;
  isPast?: boolean;
};

export const AppointmentCard = ({
  appointment,
  teacherAvatar,
  isPast = false,
}: AppointmentCardProps) => {
  const statusStyles = getStatusStyles(appointment.status);
  const isInternalLink = isInternalVideoCallLink(appointment.videoCall);
  const canJoin = !isPast && isInternalLink && appointment.videoCall;

  return (
    <div
      className={`relative flex flex-col border rounded-[25px] overflow-hidden ${
        isPast ? "opacity-50" : ""
      } ${statusStyles.borderCard}`}
      style={{
        backgroundColor: statusStyles.bgCard,
      }}
    >
      <AppointmentStatusBar
        date={appointment.date}
        time={appointment.time}
        statusStyles={statusStyles}
      />

      <div className="flex items-center px-6 py-6 gap-6">
        <AppointmentAvatar
          teacherAvatar={teacherAvatar}
          teacherName={appointment.teacherName}
        />

        <AppointmentInfo
          lesson={appointment.lesson}
          teacherName={appointment.teacherName}
          price={appointment.price}
        />

        <AppointmentJoinButton
          canJoin={!!canJoin}
          videoCall={appointment.videoCall}
          isPast={isPast}
        />
      </div>
    </div>
  );
};
