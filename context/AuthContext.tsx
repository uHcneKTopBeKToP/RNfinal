import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const json = await AsyncStorage.getItem('loggedInUser');
      if (json) setUser(JSON.parse(json));
    };
    loadUser();
  }, []);

  const register = async (username: string, password: string) => {
    const usersJson = await AsyncStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (users.find(u => u.username === username)) return false; 

    const newUser = { username, password };
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const login = async (username: string, password: string) => {
    const usersJson = await AsyncStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
