import {
  getStatusButtonClass,
  statusOptions,
  statusUi,
} from "../../util/statusButtons.tsx";
import { Button } from "../ui/button/Button.tsx";
import { TeacherStatus } from "../../api/teacher/teacher.type.ts";

type StatusChangeProps = {
  id: string;
  changeStatus: (id: string, status: TeacherStatus) => void;
  status: TeacherStatus;
};

export const StatusChange = ({
  changeStatus,
  id,
  status,
}: StatusChangeProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((s) => (
          <Button
            key={s}
            type="button"
            variant="link"
            className={getStatusButtonClass(s, s === status)}
            onClick={() => changeStatus(id, s)}
          >
            {statusUi[s].label}
          </Button>
        ))}
      </div>
    </>
  );
};
