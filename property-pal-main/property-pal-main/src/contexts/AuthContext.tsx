import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'createdAt'>, password: string) => boolean;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!user;

  const login = (email: string, password: string): boolean => {
    const storedUsers = localStorage.getItem('pms_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find(
      (u: { email: string; password: string }) => 
        u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('pms_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>, password: string): boolean => {
    const storedUsers = localStorage.getItem('pms_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const existingUser = users.find((u: { email: string }) => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User & { password: string } = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      password,
    };

    users.push(newUser);
    localStorage.setItem('pms_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('pms_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pms_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('pms_user', JSON.stringify(updatedUser));

      const storedUsers = localStorage.getItem('pms_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('pms_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
