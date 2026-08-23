// src/features/profile/utils/validators.ts

export const validateMobile = (mobile: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateRollNumber = (roll: string): boolean => {
  return roll.length >= 5 && roll.length <= 15;
};
