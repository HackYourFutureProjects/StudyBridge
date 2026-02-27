import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useUploadAvatarMutation } from "../../features/upload/useUploadAvatarMutation";
import { useDeleteAvatarMutation } from "../../features/upload/useDeleteAvatarMutation";
import { getAvatarUrl } from "../../api/upload/upload.api";
import { useModalStore } from "../../store/modals.store";
import DefaultAvatarIcon from "../../components/icons/DefaultAvatarIcon";

type ProfileAvatarProps = {
  avatarUrl?: string | null;
};

export const ProfileAvatar = ({ avatarUrl }: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadMutation = useUploadAvatarMutation();
  const deleteMutation = useDeleteAvatarMutation();
  const openModal = useModalStore((s) => s.open);

  const currentAvatarUrl: string | null | undefined =
    previewUrl || (avatarUrl ? getAvatarUrl(avatarUrl) : null);
  const hasAvatar = avatarUrl || previewUrl;

  useEffect(() => {
    if (avatarUrl && previewUrl && !selectedFile) {
      const timer = setTimeout(() => {
        setPreviewUrl(null);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [avatarUrl, previewUrl, selectedFile]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      openModal("alert", {
        title: "Invalid File Type",
        message: "Please select a JPEG, PNG or WebP image",
      });
      return;
    }

    if (file.size > 500 * 1024) {
      openModal("alert", {
        title: "File Too Large",
        message: "Image size must be less than 500KB",
      });
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.onerror = () => {
      openModal("alert", {
        title: "Error",
        message: "Failed to read the selected file",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    uploadMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
      },
      onError: (error) => {
        console.error("Upload failed:", error);
        setPreviewUrl(null);
        setSelectedFile(null);
      },
    });
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    openModal("confirmDelete", {
      title: "Delete Avatar",
      message: "Are you sure you want to delete your avatar?",
      onConfirm: () => {
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            setPreviewUrl(null);
          },
        });
      },
    });
  };

  return (
    <div className="flex-shrink-0 flex justify-center lg:justify-start">
      <div className="relative group">
        <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px] rounded-3xl bg-gray-700 flex items-center justify-center overflow-hidden">
          {hasAvatar && currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <DefaultAvatarIcon className="w-20 h-20 text-gray-400" />
              <button
                type="button"
                onClick={handleUploadClick}
                className="text-purple-400 text-5xl sm:text-6xl font-light hover:text-purple-300 transition-colors leading-none"
                disabled={uploadMutation.isPending}
              >
                +
              </button>
            </div>
          )}

          {hasAvatar && (
            <div
              className={`absolute inset-0 bg-black transition-all flex items-center justify-center ${
                selectedFile !== null
                  ? "bg-opacity-60 opacity-100"
                  : "bg-opacity-0 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100"
              }`}
            >
              {selectedFile !== null ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={uploadMutation.isPending}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {uploadMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={uploadMutation.isPending}
                    className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploadMutation.isPending}
                    className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {(uploadMutation.isPending || deleteMutation.isPending) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl flex items-center justify-center">
            <div className="text-white text-sm">
              {uploadMutation.isPending ? "Uploading..." : "Deleting..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
