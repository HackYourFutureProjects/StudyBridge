export const useAppointmentTime = () => {
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

    const now = new Date();
    return appointmentDateTime < now;
  };

  return { isPastAppointment };
};
