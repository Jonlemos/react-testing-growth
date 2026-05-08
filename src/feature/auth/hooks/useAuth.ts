'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "../services/authApi";
import { useAuthStore } from "../store/auth.store";
import { clearAllSimulationDrafts } from "@/feature/offers/store/simulation.store";
import type { LoginCredentials } from "../types";

// The refresh token is transparent — managed by proxy.ts.
// The only case that reaches here as an error is when the refreshToken also expired
// (code: 'AUTH_EXPIRED'), which signals end of session and requires a new login.
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, setUser, clearUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthApi.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/portal/home');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => AuthApi.logout(),
    onSettled: () => {
      const userId = user?.id
      if (userId) clearAllSimulationDrafts(userId)

      clearUser();
      queryClient.clear();
      router.push('/login');
    },
  });

  const handleApiError = (error: unknown) => {
    if (error instanceof Error && (error as any).code === 'AUTH_EXPIRED') {
      clearUser();
      queryClient.clear();
      router.push('/login');
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isLoggingOut: logoutMutation.isPending,
    handleApiError,
  };
};