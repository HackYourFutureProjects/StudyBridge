import { useNotificationStore } from "../../store/notification.store";
import { Button } from "../ui/button/Button";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const wrapperCva = cva("fixed bottom-5 right-5 z-[1000] flex flex-col gap-5");

const toastCva = cva(
  "flex items-center gap-2.5 px-5 py-3 rounded-lg text-white font-bold animate-toast-fadeout",
  {
    variants: {
      variant: {
        success: "bg-success-500",
        error: "bg-danger",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  },
);

type ToastProps = VariantProps<typeof toastCva>;

export const NotificationCenter = () => {
  const notification = useNotificationStore((s) => s.notification);
  const clear = useNotificationStore((s) => s.clear);

  if (!notification) {
    return null;
  }

  return (
    <Button variant="link" onClick={clear}>
      <div className={twMerge(wrapperCva())}>
        <div
          key={notification.id}
          className={twMerge(
            toastCva({
              variant: notification.variant as ToastProps["variant"],
            }),
          )}
          style={{ animationDuration: `${notification.duration}ms` }}
        >
          {notification.message}
        </div>
      </div>
    </Button>
  );
};
