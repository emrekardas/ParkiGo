'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

interface UserData {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  login: async () => { throw new Error('AuthContext not initialized') },
  logout: async () => { throw new Error('AuthContext not initialized') },
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/payment',
  '/payment/confirmation',
  '/join-us', // Join-us sayfasını public paths'e ekledim
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUserData(userData);
            setIsAdmin(userData.role === 'admin');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
        
        // Sadece korumalı sayfalarda ve kullanıcı giriş yapmamışsa yönlendir
        if (!PUBLIC_PATHS.includes(pathname)) {
          // Mevcut URL'yi kaydet
          sessionStorage.setItem('redirectUrl', pathname);
          router.push('/login');
        }
      }
      
      setLoading(false);
      setInitialLoad(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() as UserData;
      
      if (userData.role !== 'admin') {
        await signOut(auth);
        throw new Error('Unauthorized access. Only admin users can login to dashboard.');
      }

      // Login başarılı olduğunda kayıtlı URL'ye yönlendir
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl'); // URL'yi kullandıktan sonra temizle
      router.push(redirectUrl);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // İlk yükleme sırasında loading ekranı göster
  if (loading && initialLoad) {
    return null;
  }

  const value = {
    user,
    userData,
    loading,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
