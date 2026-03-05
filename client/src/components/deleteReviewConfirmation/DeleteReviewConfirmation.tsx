import { Button } from "../ui/button/Button.tsx";
import { useDeleteReviewByModeratorMutation } from "../../features/review/mutations/useDeleteReviewByModeratorMutation.ts";
import { LogoPulseIcon } from "../LogoPulsIcon/LogoPulseIcon.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  reviewId: string;
}

export const DeleteReviewByModeratorConfirmation = ({
  isOpen,
  onClose,
  teacherId,
  reviewId,
}: Props) => {
  const { mutateAsync, isPending } =
    useDeleteReviewByModeratorMutation(teacherId);

  const onConfirm = async () => {
    await mutateAsync(reviewId);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <div className="mb-6 text-gray-700">
        <p>Do you really want to delete review?</p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isPending}>
          Confirm
        </Button>
      </div>
      {isPending && <LogoPulseIcon size="sm" />}
    </div>
  );
};
