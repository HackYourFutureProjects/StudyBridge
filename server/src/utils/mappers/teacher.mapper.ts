import { WithId } from "mongodb";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";
import { TeacherViewType } from "../../types/teacher/teacher.types.js";

export const teacherMapper = (
  teacher: WithId<TeacherTypeDB>,
): TeacherViewType => {
  return {
    id: teacher.id,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    priceFrom: teacher.priceFrom,
    email: teacher.email,
    profileImageUrl: teacher.profileImageUrl,
    experience: teacher.experience,
    bio: teacher.bio,
    headline: teacher.headline,
    phoneNumber: teacher.phoneNumber,
    dateOfBirth: teacher.dateOfBirth,
    gender: teacher.gender,
    mainLanguage: teacher.mainLanguage,
    education: teacher.education,
    subjects: teacher.subjects.map((subject) => ({
      id: subject._id.toString(),
      subjectName: subject.subjectName,
      levels: subject.levels,
      experienceYears: subject.experienceYears,
      hourlyRate: subject.hourlyRate,
    })),
    availability: teacher.availability,
    address: teacher.address,
    createdAt: teacher.createdAt,
    role: teacher.role,
  };
};
