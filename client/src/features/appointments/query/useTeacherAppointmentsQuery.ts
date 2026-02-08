import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { useAuthSessionStore } from "../../../store/authSession.store";

const mockTeacherAppointments: Appointment[] = [
  {
    id: "1",
    lesson: "English",
    teacher: "1",
    student: "Anna Tkachuk",
    price: "25 euro",
    date: "5/27/15",
    time: "2:00 PM",
    status: "pending",
    videoCall: "https://meet.google.com",
  },
  {
    id: "2",
    lesson: "Business English",
    teacher: "1",
    student: "Ola Tkachuk",
    price: "30 euro",
    date: "5/28/15",
    time: "10:00 AM",
    status: "pending",
    videoCall: "https://meet.google.com",
  },
  {
    id: "3",
    lesson: "English",
    teacher: "1",
    student: "Alaa Tkachuk",
    price: "25 euro",
    date: "5/29/15",
    time: "3:00 PM",
    status: "pending",
    videoCall: "https://meet.google.com",
  },
  {
    id: "4",
    lesson: "English",
    teacher: "1",
    student: "Daria Tkachuk",
    price: "25 euro",
    date: "5/30/15",
    time: "4:00 PM",
    status: "pending",
    videoCall: "https://meet.google.com",
  },
  {
    id: "5",
    lesson: "English",
    teacher: "1",
    student: "Daryna Tkachuk",
    price: "25 euro",
    date: "5/31/15",
    time: "11:00 AM",
    status: "pending",
    videoCall: "https://meet.google.com",
  },
];

const fetchTeacherAppointments = async (
  teacherId: string,
): Promise<Appointment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockTeacherAppointments.filter(
    (appointment) => appointment.teacher === teacherId,
  );
};

export const useTeacherAppointmentsQuery = () => {
  const user = useAuthSessionStore((state) => state.user);

  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () => fetchTeacherAppointments(user?.id || ""),
    enabled: !!user?.id,
  });
};
