export const useAppointmentTime = () => {
  const LESSON_DURATION_MINUTES = 80;

  const isPastAppointment = (date: string, time: string): boolean => {
    if (!date || !time) {
      return false;
    }

    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }

    const appointmentDateTime = new Date(date);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    const appointmentEndTime = new Date(
      appointmentDateTime.getTime() + LESSON_DURATION_MINUTES * 60 * 1000,
    );

    const now = new Date();
    return now >= appointmentEndTime;
  };

  return { isPastAppointment };
};
