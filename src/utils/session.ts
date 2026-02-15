import { getSession } from 'next-auth/react';

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session;
};

// Utility function to get user role
export const getUserRole = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.user?.role || null;
};

// Utility function to check if user has a specific role
export const hasRole = async (role: string): Promise<boolean> => {
  const userRole = await getUserRole();
  return userRole === role;
};