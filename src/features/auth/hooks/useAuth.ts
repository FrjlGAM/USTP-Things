import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/api/users';
import { UserProfile } from '@/types/user';

// Extend Firebase User type with additional properties
export interface AuthUser extends FirebaseUser {
  isAnonymous?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const authUser = firebaseUser as AuthUser;
        
        // Fetch additional user data if not anonymous
        if (!authUser.isAnonymous) {
          try {
            // Prefetch user profile data
            await queryClient.prefetchQuery(
              ['userProfile', authUser.uid],
              () => userService.getUserProfile(authUser.uid)
            );
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [queryClient]);

  // Sign in with email and password
  const signIn = useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user as AuthUser;
    },
    {
      onSuccess: (user) => {
        setUser(user);
      },
    }
  );

  // Sign up with email and password
  const signUp = useMutation(
    async ({
      email,
      password,
      displayName,
    }: {
      email: string;
      password: string;
      displayName: string;
    }) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      if (user) {
        await updateFirebaseProfile(user, { displayName });
        
        // Create user profile in Firestore
        const userProfile: Partial<UserProfile> = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: user.photoURL || null,
          isVerified: false,
          verificationRequested: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await userService.updateUserProfile(user.uid, userProfile);
      }
      
      return user as AuthUser;
    },
    {
      onSuccess: (user) => {
        setUser(user);
      },
    }
  );

  // Sign out
  const signOut = useMutation(
    async () => {
      await firebaseSignOut(auth);
    },
    {
      onSuccess: () => {
        setUser(null);
        // Clear all queries on sign out
        queryClient.clear();
      },
    }
  );

  // Send password reset email
  const resetPassword = useMutation(
    async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    }
  );

  // Update user profile
  const updateProfile = useMutation(
    async (data: { displayName?: string; photoURL?: string | null }) => {
      if (!auth.currentUser) throw new Error('No user is signed in');
      
      await updateFirebaseProfile(auth.currentUser, data);
      
      // Update user profile in Firestore
      if (auth.currentUser.uid) {
        await userService.updateUserProfile(auth.currentUser.uid, {
          displayName: data.displayName,
          photoURL: data.photoURL,
          updatedAt: new Date(),
        });
      }
      
      return { ...user, ...data } as AuthUser;
    },
    {
      onSuccess: (updatedUser) => {
        if (updatedUser) {
          setUser(updatedUser);
        }
      },
    }
  );

  // Send email verification
  const sendVerificationEmail = useMutation(
    async () => {
      if (!auth.currentUser) throw new Error('No user is signed in');
      if (auth.currentUser.emailVerified) {
        throw new Error('Email is already verified');
      }
      
      await sendEmailVerification(auth.currentUser);
    }
  );

  // Sign in with Google
  const signInWithGoogle = useMutation(
    async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is new
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser && result.user.uid) {
        // Create user profile in Firestore for new users
        const userProfile: Partial<UserProfile> = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          isVerified: result.user.emailVerified,
          verificationRequested: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await userService.updateUserProfile(result.user.uid, userProfile);
      }
      
      return result.user as AuthUser;
    },
    {
      onSuccess: (user) => {
        setUser(user);
      },
    }
  );

  // Sign in anonymously
  const signInAnon = useMutation(
    async () => {
      const result = await signInAnonymously(auth);
      return result.user as AuthUser;
    },
    {
      onSuccess: (user) => {
        setUser({ ...user, isAnonymous: true });
      },
    }
  );

  // Update password
  const updateUserPassword = useMutation(
    async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No user is signed in');
      }
      
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      }
    }
  );

  return {
    // State
    user,
    loading,
    
    // Auth actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    sendVerificationEmail,
    signInWithGoogle,
    signInAnon,
    updateUserPassword,
    
    // Helper functions
    isAuthenticated: !!user && !user.isAnonymous,
    isVerified: !!user?.emailVerified,
    isAnonymous: user?.isAnonymous || false,
  };
};

export default useAuth;
