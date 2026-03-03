import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { queryKeys } from "../../queryKeys.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { moderatorChangeTeacherStatusApi } from "../../../api/moderator/moderator.api.ts";
import {
  TeacherOutputModel,
  TeacherStatus,
  TeacherType,
} from "../../../api/teacher/teacher.type.ts";
import {
  patchPublicList,
  patchTeacherInList,
} from "../../../util/patchTeachersList.util.ts";

type Vars = { id: string; status: TeacherStatus };
type Ctx = {
  prevPublicLists: Array<[readonly unknown[], TeacherOutputModel | undefined]>;
  prevModeratorLists: Array<
    [readonly unknown[], TeacherOutputModel | undefined]
  >;
  prevTeacherModeratorDetail: TeacherType | undefined;
};

export function useChangeStatusMutation() {
  const qc = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation<void, unknown, Vars, Ctx>({
    mutationFn: (vars) =>
      moderatorChangeTeacherStatusApi(vars).then(() => undefined),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: queryKeys.teachers.all });

      const prevPublicLists = qc.getQueriesData<TeacherOutputModel>({
        queryKey: ["teachers", "publicList"],
      });

      const prevModeratorLists = qc.getQueriesData<TeacherOutputModel>({
        queryKey: ["teachers", "moderatorList"],
      });

      const prevTeacherModeratorDetail = qc.getQueryData<TeacherType>(
        queryKeys.teacherModerator(id),
      );

      prevPublicLists.forEach(([key, data]) => {
        if (!data) {
          return;
        }
        qc.setQueryData<TeacherOutputModel>(
          key,
          patchPublicList(data, id, status),
        );
      });

      prevModeratorLists.forEach(([key, data]) => {
        if (!data) {
          return;
        }
        qc.setQueryData<TeacherOutputModel>(
          key,
          patchTeacherInList(data, id, status),
        );
      });

      if (prevTeacherModeratorDetail) {
        qc.setQueryData<TeacherType>(queryKeys.teacherModerator(id), {
          ...prevTeacherModeratorDetail,
          status,
        });
      }

      return {
        prevPublicLists,
        prevModeratorLists,
        prevTeacherModeratorDetail,
      };
    },
    onSuccess: async () => {
      success("Status has been successfully changed");
      await qc.invalidateQueries({ queryKey: ["teachers", "publicList"] });
    },
    onError: (error, _vars, ctx) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
      if (!ctx) {
        return;
      }
      ctx.prevPublicLists.forEach(([key, data]) => {
        if (!data) {
          return;
        }
        qc.setQueryData<TeacherOutputModel>(key, data);
      });

      ctx.prevModeratorLists.forEach(([key, data]) => {
        if (!data) {
          return;
        }
        qc.setQueryData<TeacherOutputModel>(key, data);
      });

      if (ctx.prevTeacherModeratorDetail) {
        qc.setQueryData<TeacherType>(
          _vars ? queryKeys.teacherModerator(_vars.id) : ["_"],
          ctx.prevTeacherModeratorDetail,
        );
      }
    },
    onSettled: async (_d, _e, vars) => {
      await qc.invalidateQueries({
        queryKey: queryKeys.teacherModerator(vars.id),
      });
    },
  });
}
