export const mapAuthError = (code: string) => {
  const errors: Record<string, string> = {
    BL001: "Student Not Found. Please register.",
    BL002: "OTP Expired. Please request a new one.",
    BL003: "Incorrect OTP. Try again.",
    BL004: "Too many attempts. Account temporarily locked.",
    BL007: "Session Expired. Please log in again.",
    BL008: "Device Limit reached."
  };
  return errors[code] || "An unknown error occurred.";
};