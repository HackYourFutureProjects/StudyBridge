type Role = "student" | "teacher" | "moderator";
export declare global {
  namespace Express {
    export interface Request {
      auth?: { userId: string; role: Role };
      refresh?: { token: string; payload: RefreshTokenPayload };
    }
  }
}
