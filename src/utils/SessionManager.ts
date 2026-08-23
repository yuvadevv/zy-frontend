export const SessionManager = {
  saveSession: (token: string) => { if (typeof window !== "undefined") sessionStorage.setItem("bl_session", token); },
  getSession: () => { if (typeof window !== "undefined") return sessionStorage.getItem("bl_session"); return null; },
  removeSession: () => { if (typeof window !== "undefined") sessionStorage.removeItem("bl_session"); },
  isExpired: () => false // Mock implementation
};