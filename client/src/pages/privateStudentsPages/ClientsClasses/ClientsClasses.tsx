import { useState } from "react";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import LessonsTable from "../../../components/table/LessonsTable";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { Button } from "../../../components/ui/button/Button";
import { startCall } from "../../../api/video/video.api";
import { useLocation } from "react-router-dom";

export const ClientsClasses = () => {
  const { user } = useAuthSessionStore();
  const [page, setPage] = useState(1);
  const { pathname } = useLocation();

  const accountType = useAuthSessionStore((s) => s.accountType ?? s.user?.role);
  const inferredType =
    accountType ?? (pathname.startsWith("/teacher") ? "teacher" : "student");
  const isTeacher = inferredType === "teacher";
  const isMyStudents = pathname === "/teacher/my-students";
  // const appointment = { studentId: "20e8ad65-9712-4826-b0d5-2f34a2799262" };

  const handleStartCall = async (studentId: string) => {
    if (!user?.id) return;

    try {
      const call = await startCall({
        teacherId: user.id,
        studentId,
        streamCallId: `call_${crypto.randomUUID()}`,
      });

      const callUrl = `/call/${call.id}?streamCallId=${encodeURIComponent(
        call.streamCallId,
      )}&streamCallType=${encodeURIComponent(call.streamCallType)}`;

      window.open(callUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to start call", error);
    }
  };

  const columns = isMyStudents
    ? [
        { key: "student", label: "Students", width: "260px" },
        { key: "price", label: "Price", width: "160px" },
        { key: "videoCall", label: "Video call", width: "1fr" },
      ]
    : isTeacher
      ? [
          { key: "lesson", label: "Lessons", width: "120px" },
          { key: "student", label: "Students", width: "180px" },
          { key: "date", label: "Date", width: "140px" },
          { key: "price", label: "Price", width: "120px" },
          { key: "videoCall", label: "Video call", width: "1fr" },
        ]
      : [
          { key: "lesson", label: "Lessons", width: "120px" },
          { key: "teacher", label: "Teachers", width: "180px" },
          { key: "date", label: "Date", width: "140px" },
          { key: "price", label: "Price", width: "120px" },
          { key: "videoCall", label: "Video call", width: "1fr" },
        ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col px-6 lg:px-10 min-h-screen">
        <div className="flex flex-col flex-1 pt-[40px]">
          <PageTitle title={isMyStudents ? "My Students" : "My Classes"} />
          <div className="mt-6" />
          <LessonsTable
            headerHeight={66}
            rowHeight={66}
            columns={columns}
            rows={[
              {
                id: 1,
                checked: false,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",
                videoCall: isTeacher ? (
                  <Button
                    as="button"
                    variant="link"
                    className="rounded-none min-w-0 min-h-0 font-normal text-inherit underline"
                    // // TODO: [VIDEO] Replace hardcoded studentId with appointment.studentId after appointments integration is merged. Like this way
                    // onClick={() => handleStartCall(appointment.studentId)}
                    onClick={() =>
                      handleStartCall("20e8ad65-9712-4826-b0d5-2f34a2799262")
                    }
                  >
                    Start call!
                  </Button>
                ) : (
                  "Join"
                ),
              },
              {
                id: 3,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",

                videoCall: isTeacher ? (
                  <Button
                    as="button"
                    variant="link"
                    className="rounded-none min-w-0 min-h-0 font-normal text-inherit underline"
                    // // TODO: [VIDEO] Replace hardcoded studentId with appointment.studentId after appointments integration is merged. Like this way
                    // onClick={() => handleStartCall(appointment.studentId)}
                    onClick={() =>
                      handleStartCall("ee3dce21-be6e-423a-92f2-1d0ad0460a9b")
                    }
                  >
                    Start call!
                  </Button>
                ) : (
                  "Join"
                ),
              },
              {
                id: 2,
                checked: true,
                lesson: "English",
                teacher: "Anna Tkachuk",
                student: "John Smith",
                date: "5/27/15",
                price: "25 euro",
                videoCall: isTeacher ? (
                  <Button
                    as="button"
                    variant="link"
                    className="rounded-none min-w-0 min-h-0 font-normal text-inherit underline"
                    // // TODO: [VIDEO] Replace hardcoded studentId with appointment.studentId after appointments integration is merged. Like this way
                    // onClick={() => handleStartCall(appointment.studentId)}
                    onClick={() =>
                      handleStartCall("76a73bb5-dcbb-454a-88a0-6adee35f5bbf")
                    }
                  >
                    Start call!
                  </Button>
                ) : (
                  "Join"
                ),
              },
            ]}
          />

          <div className="flex justify-center mt-auto mb-6 pt-6">
            <Pagination
              activeIndex={page}
              onIndexChange={setPage}
              totalPages={6}
              theme="secondary"
              shape="square"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
