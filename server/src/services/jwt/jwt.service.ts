import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { StudentViewType } from "../../types/student/student.types.js";
import { TeacherViewType } from "../../types/teacher/teacher.types.js";
type AccessTokenPayload = {
  userId: string;
  role: "student" | "teacher";
};
@injectable()
export class JwtService {
  secret = "1234";
  constructor() {}

  async createJWTAccessToken(
    user: StudentViewType | TeacherViewType,
  ): Promise<string> {
    return jwt.sign({ userId: user.id, role: user.role }, this.secret, {
      expiresIn: "1h",
    });
  }

  async createJWTRefreshToken(user: StudentViewType | TeacherViewType) {
    return jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      this.secret,
      { expiresIn: "2h" },
    );
  }
  async verifyToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      return jwt.verify(token, this.secret) as AccessTokenPayload;
    } catch {
      return null;
    }
  }
}
