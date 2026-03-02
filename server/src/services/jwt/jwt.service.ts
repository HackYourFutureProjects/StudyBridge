import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import {
  RefreshTokenPayload,
  PasswordResetTokenPayload,
} from "../../types/auth/auth.types.js";
import { Role } from "../../types/common.types.js";

type AccessTokenPayload = {
  userId: string;
  role: Role;
};

@injectable()
export class JwtService {
  secret = "1234";
  constructor() {}

  createJWTAccessToken({ userId, role }: AccessTokenPayload): string {
    return jwt.sign({ userId, role }, this.secret, {
      expiresIn: "1h",
    });
  }

  createJWTRefreshToken({ userId, role, sessionId }: RefreshTokenPayload) {
    return jwt.sign(
      {
        userId,
        role,
        sessionId,
      },
      this.secret,
      { expiresIn: "2h" },
    );
  }

  createPasswordResetToken(payload: PasswordResetTokenPayload) {
    return jwt.sign(payload, this.secret, { expiresIn: "3h" });
  }

  verifyPasswordResetToken(token: string): PasswordResetTokenPayload {
    return jwt.verify(token, this.secret) as PasswordResetTokenPayload;
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, this.secret) as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, this.secret) as RefreshTokenPayload;
  }
}
