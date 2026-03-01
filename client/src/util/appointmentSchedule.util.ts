import { Appointment } from "../types/appointments.types";

export interface BookedSlot {
  day: string;
  hour: number;
  studentName: string;
  lesson: string;
}

const DAYS_MAP: Record<string, string> = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

export const mapAppointmentsToBookedSlots = (
  appointments: Appointment[],
): BookedSlot[] => {
  const now = new Date();

  return appointments
    .filter((apt) => {
      if (apt.status !== "approved") return false;
      if (!apt.studentName) return false;

      const [year, month, day] = apt.date.split("-").map(Number);
      const [hours, minutes] = apt.time.split(":").map(Number);
      const appointmentDate = new Date(year, month - 1, day, hours, minutes);

      return appointmentDate > now;
    })
    .map((apt) => {
      const [year, month, day] = apt.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const hour = parseInt(apt.time.split(":")[0], 10);

      return {
        day: DAYS_MAP[dayName] || dayName,
        hour,
        studentName: apt.studentName!,
        lesson: apt.lesson,
      };
    });
};
