import { WithId } from "mongodb";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { StudentViewType } from "../../types/student/student.types.js";

export const studentMapper = (
  student: WithId<StudentTypeDB>,
): StudentViewType => {
  return {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    profileImageUrl: student.profileImageUrl,
    address: student.address,
    mainLanguage: student.mainLanguage,
    createdAt: student.createdAt,
    role: student.role,
    authProvider: student.authProvider,
    googleSub: student.googleSub,
  };
};
