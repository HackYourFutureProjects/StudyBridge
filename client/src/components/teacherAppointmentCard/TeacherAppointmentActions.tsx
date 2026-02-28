import { AppointmentStatus } from "../../types/appointments.types";
import { StatusButtons } from "../ui/statusButtons/StatusButtons";
import { Button } from "../ui/button/Button";

type TeacherAppointmentActionsProps = {
  status: AppointmentStatus;
  isPast: boolean;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  onStartCall: () => void;
  onDelete?: () => void;
};

export const TeacherAppointmentActions = ({
  status,
  isPast,
  onStatusChange,
  onStartCall,
  onDelete,
}: TeacherAppointmentActionsProps) => {
  return (
    <div className="flex flex-col items-end gap-3 min-w-[200px]">
      {!isPast && onStatusChange && (
        <StatusButtons initialStatus={status} onStatusChange={onStatusChange} />
      )}

      <Button
        as="button"
        variant="link"
        className="text-white underline text-[16px] hover:text-gray-300"
        onClick={onStartCall}
      >
        Start call!
      </Button>

      {isPast && onDelete && (
        <Button
          as="button"
          variant="link"
          className="text-red-400 underline text-[14px] hover:text-red-300"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
};
