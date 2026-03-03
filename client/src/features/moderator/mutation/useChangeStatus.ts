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
  prevTeachersQueries: Array<
    [readonly unknown[], TeacherOutputModel | undefined]
  >;
  prevTeacherDetail: TeacherType | undefined;
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
        queryKey: ["teachers", "list"],
      });

      const prevModeratorLists = qc
        .getQueriesData<TeacherOutputModel>({ queryKey: ["teachers"] })
        .filter(
          ([key]) =>
            key.length === 2 &&
            key[0] === "teachers" &&
            typeof key[1] === "object",
        );

      const prevTeacherDetail = qc.getQueryData<TeacherType>(
        queryKeys.teacher(id),
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

      if (prevTeacherDetail) {
        qc.setQueryData<TeacherType>(queryKeys.teacher(id), {
          ...prevTeacherDetail,
          status,
        });
      }

      return {
        prevTeachersQueries: [...prevPublicLists, ...prevModeratorLists],
        prevTeacherDetail,
      };
    },
    onSuccess: async () => {
      success("Status has been successfully changed");
      await qc.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey;
          return key[0] === "teachers" && key[1] === "list";
        },
      });
    },
    onError: (error, _vars, ctx) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
      if (!ctx) {
        return;
      }
      ctx.prevTeachersQueries.forEach(([key, data]) => {
        if (data === undefined) {
          return;
        }
        qc.setQueryData<TeacherOutputModel>(key, data);
      });

      if (ctx.prevTeacherDetail !== undefined) {
        qc.setQueryData<TeacherType>(
          queryKeys.teacher(_vars.id),
          ctx.prevTeacherDetail,
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.teacher(id) });
    },
  });
}
