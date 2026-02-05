type Role = "student" | "teacher";
export declare global {
  namespace Express {
    export interface Request {
      auth?: { userId: string; role: Role };
    }
  }
}
