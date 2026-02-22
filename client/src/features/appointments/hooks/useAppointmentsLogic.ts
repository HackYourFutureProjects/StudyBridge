import { useState, useMemo, useCallback } from "react";
import { useModalStore } from "../../../store/modals.store";
import { useUpdateAppointmentMutation } from "../mutations/useUpdateAppointmentMutation";
import { useDeleteAppointmentMutation } from "../mutations/useDeleteAppointmentMutation";
import {
  Appointment,
  AppointmentStatus,
} from "../../../types/appointments.types";
import { LessonRowData } from "../../../components/table/LessonRow";

const ITEMS_PER_PAGE = 10;

export const useAppointmentsLogic = (
  appointments: Appointment[],
  isTeacher: boolean,
) => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { open: openModal } = useModalStore();

  const updateAppointmentMutation = useUpdateAppointmentMutation();
  const deleteAppointmentMutation = useDeleteAppointmentMutation();

  const isPastAppointment = useCallback(
    (date: string, time: string): boolean => {
      const [hours, minutes] = time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        return false;
      }

      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      return appointmentDateTime < now;
    },
    [],
  );

  const handleStatusChange = useCallback(
    (appointmentId: string, newStatus: AppointmentStatus) => {
      updateAppointmentMutation.mutate({
        appointmentId,
        status: newStatus,
      });
    },
    [updateAppointmentMutation],
  );

  const handleDelete = useCallback(
    (appointmentId: string) => {
      openModal("confirmDelete", {
        title: "Delete Appointment",
        message: "Are you sure you want to delete this appointment?",
        onConfirm: () => {
          deleteAppointmentMutation.mutate(appointmentId);
        },
      });
    },
    [openModal, deleteAppointmentMutation],
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return;

    const selectedAppointments = appointments.filter((apt) =>
      selectedIds.includes(apt.id),
    );

    const futureAppointments = selectedAppointments.filter(
      (apt) => !isPastAppointment(apt.date, apt.time),
    );

    if (futureAppointments.length > 0) {
      openModal("alert", {
        title: "Cannot Delete",
        message: "You cannot delete future lesson",
      });
      return;
    }

    openModal("confirmDelete", {
      title: "Delete Appointments",
      message: `Are you sure you want to delete ${selectedIds.length} appointment(s)?`,
      onConfirm: async () => {
        const deletePromises = selectedIds.map((id) =>
          deleteAppointmentMutation.mutateAsync(id),
        );

        const results = await Promise.allSettled(deletePromises);

        const failures = results.filter(
          (result) => result.status === "rejected",
        );

        if (failures.length === 0) {
          setSelectedIds([]);
        } else {
          openModal("alert", {
            title: "Delete Failed",
            message: `Failed to delete ${failures.length} appointment(s). Please try again.`,
          });
        }
      },
    });
  }, [
    selectedIds,
    appointments,
    isPastAppointment,
    openModal,
    deleteAppointmentMutation,
  ]);

  const tableRows = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment.id,
        checked: false,
        lesson: appointment.lesson,
        student: appointment.student,
        teacher: appointment.teacher,
        price: appointment.price,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        onStatusChange: isTeacher
          ? (newStatus: AppointmentStatus) =>
              handleStatusChange(appointment.id, newStatus)
          : undefined,
        canDelete: isPastAppointment(appointment.date, appointment.time),
        onDelete: isPastAppointment(appointment.date, appointment.time)
          ? () => handleDelete(appointment.id)
          : undefined,
      })) as LessonRowData[],
    [
      appointments,
      isTeacher,
      handleStatusChange,
      handleDelete,
      isPastAppointment,
    ],
  );

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);

  const validPage = useMemo(() => {
    if (page > totalPages && totalPages > 0) {
      return totalPages;
    }
    return page;
  }, [page, totalPages]);

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRows = tableRows.slice(startIndex, endIndex);

  return {
    page: validPage,
    setPage,
    selectedIds,
    setSelectedIds,
    totalPages,
    paginatedRows,
    handleBulkDelete,
    isPastAppointment,
  };
};
