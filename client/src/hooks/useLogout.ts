import { useLogoutMutation } from "../features/auth/mutations/useLogoutMutation";

export const useLogout = () => {
  const logoutMutation = useLogoutMutation();

  const logout = () => {
    logoutMutation.mutate();
  };
  return {
    logout,
    isPending: logoutMutation.isPending,
    error: logoutMutation.error,
  };
};
