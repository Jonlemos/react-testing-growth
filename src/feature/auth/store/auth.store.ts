'use client'

import { create } from "zustand";
import type { User, AuthState } from "../types";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));
