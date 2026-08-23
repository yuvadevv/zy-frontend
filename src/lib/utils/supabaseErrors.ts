// src/lib/utils/supabaseErrors.ts

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export const formatSupabaseError = (error: unknown): AppError => {
  if (typeof error === 'object' && error !== null) {
    const err = error as { name?: string; code?: string; message?: string; details?: unknown };
    
    // Auth errors
    if (err.name === 'AuthApiError' || err.code?.startsWith('auth/')) {
      return {
        code: 'AUTH_ERROR',
        message: err.message || 'Authentication failed',
        details: err
      };
    }
    
    // PostgREST errors
    if (err.code && err.details !== undefined) {
      return {
        code: `DB_ERROR_${err.code}`,
        message: err.message || 'Database operation failed',
        details: err.details
      };
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: error
  };
};
