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
  const isInRegular = !!onRemoveFromRegular;

  return (
    <div className="flex flex-col items-center min-[540px]:items-end gap-2 md:gap-3 w-full sm:w-auto sm:min-w-[200px] min-[540px]:ml-auto">
      {!isPast && !isRegularTab && onStatusChange && (
        <StatusButtons initialStatus={status} onStatusChange={onStatusChange} />
      )}

      {!isPast &&
        !isRegularTab &&
        status === "approved" &&
        !isInRegular &&
        onAddToRegular && (
          <Button
            as="button"
            variant="link"
            className="text-green-400 underline text-[12px] md:text-[14px] hover:text-green-300"
            onClick={onAddToRegular}
          >
            Add to Regular Students
          </Button>
        )}

      {!isPast && onRemoveFromRegular && (
        <Button
          as="button"
          variant="link"
          className="text-purple-400 underline text-[12px] md:text-[14px] hover:text-purple-300"
          onClick={onRemoveFromRegular}
        >
          Remove from Regular Students
        </Button>
      )}

      <Button
        as="button"
        variant="link"
        className="text-white underline text-[14px] md:text-[16px] hover:text-gray-300"
        onClick={onStartCall}
      >
        Start call!
      </Button>

      {onDelete && (
        <Button
          as="button"
          variant="link"
          className="text-red-400 underline text-[12px] md:text-[14px] hover:text-red-300"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
};
