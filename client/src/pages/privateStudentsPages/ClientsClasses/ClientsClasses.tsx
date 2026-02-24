import { useState } from "react";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import LessonsTable from "../../../components/table/LessonsTable";
import { PageTitle } from "../../../components/pageTitle/PageTitle";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button/Button";
import { startCall } from "../../../api/video/video.api";

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
      console.log("Call started:", call.id, call.streamCallId);
      // later: we navigate to video call page
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
      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <div className="pt-[40px] flex flex-col flex-1">
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
                    className="text-inherit underline font-normal min-h-0 min-w-0 rounded-none"
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
                    className="text-inherit underline font-normal min-h-0 min-w-0 rounded-none"
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
                    className="text-inherit underline font-normal min-h-0 min-w-0 rounded-none"
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

          <div className="mt-auto mb-6 flex justify-center pt-6">
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
