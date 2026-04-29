
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'USER' | 'ADMIN';
export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface ConversionRecord {
  id: string;
  style: string;
  originalUrl: string;
  resultUrl: string;
  date: string;
  creditsUsed: number;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'EARN' | 'SPEND';
  description: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  plan: PlanType;
  credits: number;
  conversions: ConversionRecord[];
  transactions: CreditTransaction[];
  billingDate?: string;
}

interface AuthContextType {
  user: User | null;
  groqKey: string | null;
  loginWithGoogle: () => void;
  logout: () => void;
  saveGroqKey: (key: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Credit & Plan Actions
  deductCredit: (amount: number, description: string) => boolean;
  addCredits: (amount: number, description: string) => void;
  upgradePlan: (plan: PlanType) => void;
  addConversion: (record: ConversionRecord) => void;
  deleteConversion: (id: string) => void;
  
  // Admin Actions
  allUsers: User[]; 
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [groqKey, setGroqKey] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('linear_user_v3');
    const savedKey = localStorage.getItem('linear_groq_key');
    const savedAllUsers = localStorage.getItem('linear_admin_users_v3');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedKey) setGroqKey(savedKey);
    if (savedAllUsers) setAllUsers(JSON.parse(savedAllUsers));
  }, []);

  const saveState = (updatedUser: User | null, usersList: User[]) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('linear_user_v3', JSON.stringify(updatedUser));
      
      const index = usersList.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        usersList[index] = updatedUser;
      } else {
        usersList.push(updatedUser);
      }
    }
    setAllUsers([...usersList]);
    localStorage.setItem('linear_admin_users_v3', JSON.stringify(usersList));
  };

  const loginWithGoogle = () => {
    const email = "alex@linear.ai";
    const existing = allUsers.find(u => u.email === email);
    
    if (existing) {
      saveState(existing, allUsers);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: "Alex Design",
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`,
        role: 'ADMIN',
        plan: 'FREE',
        credits: 5,
        conversions: [],
        transactions: [
          { id: 't1', amount: 5, type: 'EARN', description: 'Signup Bonus', date: new Date().toISOString() }
        ],
        billingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      saveState(newUser, [newUser]);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('linear_user_v3');
  };

  const deductCredit = (amount: number, description: string): boolean => {
    if (!user) return false;
    if (user.plan !== 'ENTERPRISE' && user.credits < amount) return false;

    const updated: User = {
      ...user,
      credits: user.plan === 'ENTERPRISE' ? user.credits : user.credits - amount,
      transactions: [
        { id: Math.random().toString(36).substr(2, 9), amount, type: 'SPEND', description, date: new Date().toISOString() },
        ...user.transactions
      ]
    };
    saveState(updated, allUsers);
    return true;
  };

  const addCredits = (amount: number, description: string) => {
    if (!user) return;
    const updated: User = {
      ...user,
      credits: user.credits + amount,
      transactions: [
        { id: Math.random().toString(36).substr(2, 9), amount, type: 'EARN', description, date: new Date().toISOString() },
        ...user.transactions
      ]
    };
    saveState(updated, allUsers);
  };

  const upgradePlan = (plan: PlanType) => {
    if (!user) return;
    let creditsToAdd = 0;
    if (plan === 'PRO') creditsToAdd = 100;
    
    const updated: User = {
      ...user,
      plan,
      credits: user.credits + creditsToAdd,
      transactions: [
        { id: Math.random().toString(36).substr(2, 9), amount: creditsToAdd, type: 'EARN', description: `Plan Upgrade to ${plan}`, date: new Date().toISOString() },
        ...user.transactions
      ]
    };
    saveState(updated, allUsers);
  };

  const addConversion = (record: ConversionRecord) => {
    if (!user) return;
    const updated: User = {
      ...user,
      conversions: [record, ...user.conversions]
    };
    saveState(updated, allUsers);
  };

  const deleteConversion = (id: string) => {
    if (!user) return;
    const updated: User = {
      ...user,
      conversions: user.conversions.filter(c => c.id !== id)
    };
    saveState(updated, allUsers);
  };

  const adminUpdateUser = (userId: string, updates: Partial<User>) => {
    const newList = allUsers.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updates };
        if (user?.id === userId) setUser(updated);
        return updated;
      }
      return u;
    });
    saveState(null, newList); // Just update list if not current user
    if (user && user.id === userId) {
       setUser({ ...user, ...updates });
    }
  };

  const saveGroqKey = (key: string) => {
    setGroqKey(key);
    localStorage.setItem('linear_groq_key', key);
  };

  return (
    <AuthContext.Provider value={{ 
      user, groqKey, loginWithGoogle, logout, saveGroqKey, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN',
      deductCredit, addCredits, upgradePlan, addConversion, deleteConversion,
      allUsers, adminUpdateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
