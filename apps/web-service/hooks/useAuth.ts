import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access auth context
 * This is a simple wrapper around useAuthContext for cleaner API
 */
export function useAuth() {
  return useAuthContext();
}

