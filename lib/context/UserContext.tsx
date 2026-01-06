"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/user'; // Import the User interface

// Define the shape of our context value
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginUser: (userData: User, token: string) => void;
  logoutUser: () => void;
  updateUser: (userData: User) => void; // Add updateUser
}

// Create the context with a default null value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback((userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          let userData = JSON.parse(storedUser);
          // Fix for corrupted data from previous bug where whole response was saved
          if (userData.data && userData.data.id) {
            userData = userData.data;
            localStorage.setItem("user", JSON.stringify(userData));
          }
          setUser(userData);
        }
      } catch (err: any) {
        console.error("Failed to parse user from localStorage", err);
        setError("Failed to load user session.");
        logoutUser(); // Clear invalid data
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    const handleLoginEvent = () => {
      // Re-initialize user state based on localStorage after a login event
      initializeUser();
    };

    const handleLogoutEvent = () => {
      // Clear user state after a logout event
      logoutUser();
    };

    window.addEventListener("loginEvent", handleLoginEvent);
    window.addEventListener("logoutEvent", handleLogoutEvent);

    return () => {
      window.removeEventListener("loginEvent", handleLoginEvent);
      window.removeEventListener("logoutEvent", handleLogoutEvent);
    };
  }, [logoutUser]);

  return (
    <UserContext.Provider value={{ user, loading, error, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
