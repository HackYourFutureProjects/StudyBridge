import { getAvatarUrl } from "../../api/upload/upload.api";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";

type TeacherAppointmentAvatarProps = {
  studentAvatar?: string | null;
  studentName?: string;
};

export const TeacherAppointmentAvatar = ({
  studentAvatar,
  studentName,
}: TeacherAppointmentAvatarProps) => {
  const avatarUrl = getAvatarUrl(studentAvatar || null);

  return (
    <div className="flex-shrink-0">
      <div className="w-24 h-24 overflow-hidden rounded-[20px]">
        {avatarUrl ? (
          <img
            className="w-full h-full object-cover"
            src={avatarUrl}
            alt={studentName || "Student"}
          />
        ) : (
          <DefaultAvatarIcon className="w-full h-full" />
        )}
      </div>
    </div>
  );
};
