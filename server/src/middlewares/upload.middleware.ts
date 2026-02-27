import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG and WebP images are allowed.",
      ),
    );
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024,
  },
}).single("avatar");

export const uploadAvatarWithLogging = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadAvatar(req, res, (err: unknown) => {
    if (err) {
      return res.status(400).json({ message: (err as Error).message });
    }
    return next();
  });
};
