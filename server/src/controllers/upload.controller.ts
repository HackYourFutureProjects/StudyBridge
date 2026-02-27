import { Request, Response } from "express";
import { TeacherModel } from "../db/schemes/teacherSchema.js";
import { StudentModel } from "../db/schemes/studentSchema.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

interface AuthRequest extends Request {
  auth?: {
    userId: string;
    role: "teacher" | "student";
  };
}

export class UploadController {
  async uploadAvatar(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.auth?.userId;
      const role = authReq.auth?.role;

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const stream = Readable.from(req.file.buffer);

      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              public_id: `${role}-${userId}`,
              overwrite: true,
              transformation: [
                { width: 500, height: 500, crop: "fill", gravity: "face" },
                { quality: "auto" },
                { fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Upload failed"));
            },
          );

          stream.pipe(uploadStream);
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Model: any = role === "teacher" ? TeacherModel : StudentModel;

      await Model.updateOne(
        { id: userId },
        { $set: { profileImageUrl: uploadResult.secure_url } },
      );

      return res.status(200).json({
        message: "Avatar uploaded successfully",
        avatarUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }
  }

  async deleteAvatar(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.auth?.userId;
      const role = authReq.auth?.role;

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Model: any = role === "teacher" ? TeacherModel : StudentModel;
      const user = await Model.findOne({ id: userId });

      if (!user || !user.profileImageUrl) {
        return res.status(404).json({ message: "No avatar to delete" });
      }

      const publicId = `avatars/${role}-${userId}`;

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // Cloudinary error is not critical, continue with DB update
      }

      await Model.updateOne(
        { id: userId },
        { $set: { profileImageUrl: null } },
      );

      return res.status(200).json({ message: "Avatar deleted successfully" });
    } catch {
      return res.status(500).json({ message: "Failed to delete avatar" });
    }
  }
}
