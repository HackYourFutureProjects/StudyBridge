import { Button } from "../ui/button/Button";

type AppointmentJoinButtonProps = {
  canJoin: boolean;
  videoCall?: string;
  isPast: boolean;
  onDelete?: () => void;
};

export const AppointmentJoinButton = ({
  canJoin,
  videoCall,
  isPast,
  onDelete,
}: AppointmentJoinButtonProps) => {
  if (isPast && onDelete) {
    return (
      <div className="flex items-center justify-center min-[480px]:ml-auto">
        <Button
          as="button"
          variant="link"
          className="text-red-400 underline text-[12px] md:text-[14px] hover:text-red-300"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-[480px]:ml-auto">
      {canJoin ? (
        <Button
          as="a"
          href={videoCall}
          target="_blank"
          rel="noopener noreferrer"
          variant="link"
          className="text-white underline text-[14px] md:text-[16px] hover:text-gray-300"
        >
          Join
        </Button>
      ) : (
        <span className="text-gray-500 text-[14px] md:text-[16px]">
          {isPast ? "Past" : "N/A"}
        </span>
      )}
    </div>
  );
};
