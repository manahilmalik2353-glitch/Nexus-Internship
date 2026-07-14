import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import toast from 'react-hot-toast';
import API from '../api';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const TOKEN_STORAGE_KEY = 'token';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Login with backend API
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      const loggedInUser = response.data.user;

      if (loggedInUser.role !== role) {
        throw new Error(`This account is registered as ${loggedInUser.role}, not ${role}`);
      }

      const frontendUser: User = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        role: loggedInUser.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(loggedInUser.name)}&background=random`,
        bio: loggedInUser.bio || '',
        isOnline: true,
        createdAt: loggedInUser.createdAt || new Date().toISOString(),
      };

      setUser(frontendUser);

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(frontendUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

      toast.success('Successfully logged in!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with backend API
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      const registeredUser = response.data.user;

      const frontendUser: User = {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        role: registeredUser.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(registeredUser.name)}&background=random`,
        bio: registeredUser.bio || '',
        isOnline: true,
        createdAt: registeredUser.createdAt || new Date().toISOString(),
      };

      setUser(frontendUser);

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(frontendUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);

      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password mock function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);

      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Reset password mock function
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);

      if (token !== storedToken) {
        throw new Error('Invalid or expired reset token');
      }

      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  // Update user profile with backend API
  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      const response = await API.put('/auth/profile', updates);

      const updatedBackendUser = response.data.user;

      const updatedUser: User = {
        ...(user as User),
        id: updatedBackendUser.id || userId,
        name: updatedBackendUser.name || user?.name || '',
        email: updatedBackendUser.email || user?.email || '',
        role: updatedBackendUser.role || user?.role || 'entrepreneur',
        avatarUrl:
          user?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedBackendUser.name || user?.name || '')}&background=random`,
        bio: updatedBackendUser.bio || updates.bio || user?.bio || '',
        isOnline: true,
        createdAt: user?.createdAt || new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};