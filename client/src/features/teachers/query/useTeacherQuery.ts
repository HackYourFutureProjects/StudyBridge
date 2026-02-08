import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { TeacherType } from "../../../types/teacher.types";

const mockTeachers: TeacherType[] = [
  {
    id: "1",
    name: "Els Menson",
    subject: "English",
    image: "/src/assets/images/person.jpg",
    experience: "12 years",
    education: "University of Amsterdam",
    price: 35,
    approaching:
      "Communicative, student-centered methodology focused on real-life English. Lessons emphasize speaking practice, practical vocabulary, and personalized learning goals.",
    availableTimeSlots: ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    schedule: {
      "2024-01-15": ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      "2024-01-16": ["10:00", "11:00", "14:00", "15:00"],
      "2024-01-17": ["9:00", "10:00", "14:00", "15:00", "16:00"],
    },
  },
  {
    id: "2",
    name: "John Smith",
    subject: "Business English",
    image: "/src/assets/images/person.jpg",
    experience: "8 years",
    education: "Harvard Business School",
    price: 45,
    approaching:
      "Business-focused English training with emphasis on professional communication, presentations, and corporate vocabulary.",
    availableTimeSlots: ["8:00", "9:00", "13:00", "14:00", "17:00", "18:00"],
    schedule: {
      "2024-01-15": ["8:00", "9:00", "13:00", "14:00"],
      "2024-01-16": ["9:00", "13:00", "14:00", "17:00", "18:00"],
      "2024-01-17": ["8:00", "9:00", "13:00", "14:00", "17:00"],
    },
  },
  {
    id: "3",
    name: "Anna Tkachuk",
    subject: "English",
    image: "/src/assets/images/person.jpg",
    experience: "10 years",
    education: "Kyiv National University",
    price: 30,
    approaching:
      "Interactive and engaging teaching style with focus on grammar, pronunciation, and conversational skills.",
    availableTimeSlots: ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    schedule: {
      "2024-01-15": ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      "2024-01-16": ["10:00", "11:00", "14:00", "15:00"],
      "2024-01-17": ["9:00", "10:00", "14:00", "15:00", "16:00"],
    },
  },
];

const fetchTeacher = async (teacherId: string): Promise<TeacherType> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const teacher = mockTeachers.find((teacher) => teacher.id === teacherId);

  if (!teacher) {
    throw new Error(`Teacher with id ${teacherId} not found`);
  }

  return teacher;
};

export const useTeacherQuery = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.teacher(teacherId),
    queryFn: () => fetchTeacher(teacherId),
    enabled: !!teacherId,
  });
};
