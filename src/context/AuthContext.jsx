
import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Mock users
const mockUsers = {
  musicians: [
    { id: 1, username: 'musician1', name: 'John Beats', role: 'musician' },
    { id: 2, username: 'musician2', name: 'Sarah Sounds', role: 'musician' }
  ],
  creators: [
    { id: 3, username: 'creator1', name: 'TikTok Prince', role: 'creator' },
    { id: 4, username: 'creator2', name: 'Dance Queen', role: 'creator' }
  ]
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage (simulating persistent session)
    const storedUser = localStorage.getItem('tikTokUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, role) => {
    const userList = role === 'musician' ? mockUsers.musicians : mockUsers.creators;
    const foundUser = userList.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('tikTokUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
      return true;
    } else {
      toast.error('Invalid username');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tikTokUser');
    toast.info('You have been logged out');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isMusician: user && user.role === 'musician',
    isCreator: user && user.role === 'creator',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
