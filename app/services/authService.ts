// authService.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Email ve Şifre ile Giriş Yapma
export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    // Önce bu email için mevcut giriş yöntemlerini kontrol et
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    if (methods.includes('google.com') && !methods.includes('password')) {
      throw {
        code: 'auth/google-account',
        message: 'This email is registered with Google. Please sign in with Google.'
      };
    }

    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw error;
  }
};

// Email ve Şifre ile Kayıt Olma
export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    // Önce bu email için mevcut giriş yöntemlerini kontrol et
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    if (methods.includes('google.com')) {
      throw {
        code: 'auth/google-account',
        message: 'This email is already registered with Google. Please sign in with Google.'
      };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Kullanıcı dokümanını kontrol et
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Eğer kullanıcı dokümanı yoksa oluştur
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName || 'User',
        role: 'user'
      });
    }

    // Email/şifre yöntemi ekle (eğer yoksa)
    if (result.user.email && !result.user.providerData.some(p => p.providerId === 'password')) {
      try {
        // Rastgele bir şifre oluştur
        const tempPassword = Math.random().toString(36).slice(-8);
        const credential = EmailAuthProvider.credential(result.user.email, tempPassword);
        await linkWithCredential(result.user, credential);
      } catch (linkError) {
        // Bağlama hatası olursa görmezden gel (muhtemelen zaten bağlı)
        console.log('Credential linking error:', linkError);
      }
    }

    return result.user;
  } catch (error: any) {
    throw error;
  }
};