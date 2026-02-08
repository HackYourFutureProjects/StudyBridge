export type TeacherType = {
  id: string;
  name: string;
  subject: string;
  image: string;
  experience: string;
  education: string;
  price: number;
  approaching: string;
  availableTimeSlots?: string[];
  schedule?: {
    [date: string]: string[];
  };
};
