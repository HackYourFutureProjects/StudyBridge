import { getAvatarUrl } from "../../api/upload/upload.api";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";

type AppointmentAvatarProps = {
  teacherAvatar?: string | null;
  teacherName?: string;
};

export const AppointmentAvatar = ({
  teacherAvatar,
  teacherName,
}: AppointmentAvatarProps) => {
  const avatarUrl = getAvatarUrl(teacherAvatar || null);

  return (
    <div className="flex-shrink-0">
      <div className="w-24 h-24 overflow-hidden rounded-[20px]">
        {avatarUrl ? (
          <img
            className="w-full h-full object-cover"
            src={avatarUrl}
            alt={teacherName || "Teacher"}
          />
        ) : (
          <DefaultAvatarIcon className="w-full h-full" />
        )}
      </div>
    </div>
  );
};
