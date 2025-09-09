import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'student' | 'instructor';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'student' | 'instructor') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, role: 'student' | 'instructor'): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    if (username && password) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        username,
        role,
        name: `${role === 'student' ? 'Student' : 'Instructor'} ${username}`,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};