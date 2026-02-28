import { AppointmentStatus } from "../../types/appointments.types";
import { StatusButtons } from "../ui/statusButtons/StatusButtons";
import { Button } from "../ui/button/Button";

type TeacherAppointmentActionsProps = {
  status: AppointmentStatus;
  isPast: boolean;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  onStartCall: () => void;
  onDelete?: () => void;
  onAddToRegular?: () => void;
  onRemoveFromRegular?: () => void;
  isRegularTab?: boolean;
};

export const TeacherAppointmentActions = ({
  status,
  isPast,
  onStatusChange,
  onStartCall,
  onDelete,
  onAddToRegular,
  onRemoveFromRegular,
  isRegularTab = false,
}: TeacherAppointmentActionsProps) => {
  return (
    <div className="flex flex-col items-end gap-3 min-w-[200px]">
      {!isPast && onStatusChange && !isRegularTab && (
        <StatusButtons initialStatus={status} onStatusChange={onStatusChange} />
      )}

      {status === "approved" && !isPast && onAddToRegular && (
        <Button
          as="button"
          variant="link"
          className="text-green-400 underline text-[14px] hover:text-green-300"
          onClick={onAddToRegular}
        >
          Add to Regular Students
        </Button>
      )}

      {onRemoveFromRegular && (
        <Button
          as="button"
          variant="link"
          className="text-purple-400 underline text-[14px] hover:text-purple-300"
          onClick={onRemoveFromRegular}
        >
          Remove from Regular
        </Button>
      )}

      <Button
        as="button"
        variant="link"
        className="text-white underline text-[16px] hover:text-gray-300"
        onClick={onStartCall}
      >
        Start call!
      </Button>

      {onDelete && (
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
