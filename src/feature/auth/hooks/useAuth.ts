'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthApi } from "../services/authApi";
import { useAuthStore } from "../store/auth.store";
import { clearAllSimulationDrafts } from "@/feature/Offers/store/simulation.store";
import type { LoginCredentials } from "../types";

// O refresh token é transparente — gerenciado pelo proxy.ts.
// O único caso que chega aqui como erro é quando o refreshToken também expirou
// (code: 'AUTH_EXPIRED'), o que sinaliza fim de sessão e requer novo login.
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