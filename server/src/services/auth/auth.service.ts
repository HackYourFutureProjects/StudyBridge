import { inject, injectable } from "inversify";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TYPES } from "../../composition/composition.types.js";
import { HttpError } from "../../utils/error.util.js";
import { studentMapper } from "../../utils/mappers/student.mapper.js";
import bcrypt from "bcryptjs";

@injectable()
export class AuthService {
  constructor(@inject(TYPES.StudentQuery) private studentQuery: StudentQuery) {}

  async checkAuthStudentCredentials(email: string, password: string) {
    const student = await this.studentQuery.findUserByEmailWithHash(email);

    if (!student) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordHash = await this._generateHash(
      password,
      student.passwordSalt,
    );

    if (student.passwordHash === passwordHash) {
      return studentMapper(student);
    } else {
      throw new HttpError(401, "Invalid credentials");
    }
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
