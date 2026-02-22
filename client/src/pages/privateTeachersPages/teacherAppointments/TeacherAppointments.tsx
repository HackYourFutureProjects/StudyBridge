import { PageTitle } from "../../../components/pageTitle/PageTitle";
import LessonsTable from "../../../components/table/LessonsTable";
import { Pagination } from "../../../components/ui/pagination/Pagination";
import { useTeacherAppointmentsQuery } from "../../../features/appointments/query/useTeacherAppointmentsQuery";
import { useAppointmentsLogic } from "../../../features/appointments/hooks/useAppointmentsLogic";

export const TeacherAppointments = () => {
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useTeacherAppointmentsQuery();

  const {
    page,
    setPage,
    setSelectedIds,
    totalPages,
    paginatedRows,
    handleBulkDelete,
    isPastAppointment,
  } = useAppointmentsLogic(appointments, true);

  const columns = [
    { key: "lesson", label: "Lessons", width: "130px" },
    { key: "student", label: "Students", width: "184px" },
    { key: "price", label: "Price", width: "146px" },
    { key: "date", label: "Date", width: "146px" },
    { key: "time", label: "Time", width: "146px" },
    { key: "status", label: "Status", width: "200px" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-10 min-h-screen flex flex-col">
          <div className="pt-[40px] flex flex-col flex-1">
            <div className="text-white text-center">
              Loading appointments...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-10 min-h-screen flex flex-col">
          <div className="pt-[40px] flex flex-col flex-1">
            <div className="text-white text-center">
              Error loading appointments
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <div className="pt-[40px] flex flex-col flex-1">
          <PageTitle title="My Appointments" />

          <div className="mt-6" />

          <LessonsTable
            headerHeight={66}
            rowHeight={66}
            columns={columns}
            useStatusButtons={true}
            rows={paginatedRows}
            onSelectionChange={setSelectedIds}
            onBulkDelete={handleBulkDelete}
            isPastAppointment={isPastAppointment}
          />

          {totalPages > 1 && (
            <div className="mt-auto pt-4 mb-6 flex justify-center">
              <Pagination
                activeIndex={page}
                onIndexChange={setPage}
                totalPages={totalPages}
                theme="secondary"
                shape="square"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
