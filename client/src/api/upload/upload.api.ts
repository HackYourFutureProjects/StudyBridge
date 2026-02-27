import { apiProtected } from "../api";

export interface UploadAvatarResponse {
  message: string;
  avatarUrl: string;
  filename: string;
}

export const uploadAvatarApi = async (
  file: File,
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiProtected.post<UploadAvatarResponse>(
    "/api/upload/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteAvatarApi = async (): Promise<{ message: string }> => {
  const response = await apiProtected.delete<{ message: string }>(
    "/api/upload/avatar",
  );
  return response.data;
};

export const getAvatarUrl = (filename: string | null): string | null => {
  if (!filename) {
    return null;
  }

  // Cloudinary URLs are full URLs starting with http/https
  return filename;
};
