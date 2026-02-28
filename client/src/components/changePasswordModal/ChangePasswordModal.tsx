import React, { useState } from "react";
import { Button } from "../ui/button/Button";
import Eye from "../icons/Eye";
import ClosedEye from "../icons/ClosedEye";
import Cross from "../icons/Cross";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 5) {
      setError("New password must be at least 5 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch {
      setError("Failed to change password. Please check your old password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>

      <div className="relative bg-[#1E1D2B] rounded-lg p-6 sm:p-8 max-w-md w-full mx-4 z-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors"
          aria-label="Close"
        >
          <Cross className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-2">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showOldPassword ? <Eye /> : <ClosedEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <Eye /> : <ClosedEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-[#15141D] border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <Eye /> : <ClosedEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
