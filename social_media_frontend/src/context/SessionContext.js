import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

// PUBLIC_INTERFACE
export const SessionContext = createContext(null);

// PUBLIC_INTERFACE
export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function SessionProvider({ children }) {
  /**
   * This session is simplified for demo:
   * - Keeps a selectedUserId (admin can switch)
   * - Loads profile for the selected user
   */
  const [selectedUserId, setSelectedUserId] = useState(() => {
    const raw = localStorage.getItem("selectedUserId");
    return raw ? JSON.parse(raw) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);

  // Persist selected user
  useEffect(() => {
    localStorage.setItem("selectedUserId", JSON.stringify(selectedUserId));
  }, [selectedUserId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!selectedUserId) {
        setProfile(null);
        return;
      }
      setLoadingProfile(true);
      setError(null);
      try {
        const p = await api.getProfile(selectedUserId);
        if (!ignore) setProfile(p);
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load profile");
      } finally {
        if (!ignore) setLoadingProfile(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [selectedUserId]);

  const value = useMemo(
    () => ({
      selectedUserId,
      setSelectedUserId,
      profile,
      loadingProfile,
      error,
      refreshProfile: async () => {
        if (!selectedUserId) return;
        const p = await api.getProfile(selectedUserId);
        setProfile(p);
      },
    }),
    [selectedUserId, profile, loadingProfile, error]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
