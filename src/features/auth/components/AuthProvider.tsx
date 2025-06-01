import React, { createContext, useContext, ReactNode, useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '@/types/user';

// Extend the auth context with additional user data from Firestore
interface AuthContextType {
  // From useAuth
  user: ReturnType<typeof useAuth>['user'];
  loading: boolean;
  signIn: ReturnType<typeof useAuth>['signIn'];
  signUp: ReturnType<typeof useAuth>['signUp'];
  signOut: ReturnType<typeof useAuth>['signOut'];
  resetPassword: ReturnType<typeof useAuth>['resetPassword'];
  updateProfile: ReturnType<typeof useAuth>['updateProfile'];
  sendVerificationEmail: ReturnType<typeof useAuth>['sendVerificationEmail'];
  signInWithGoogle: ReturnType<typeof useAuth>['signInWithGoogle'];
  signInAnon: ReturnType<typeof useAuth>['signInAnon'];
  updateUserPassword: ReturnType<typeof useAuth>['updateUserPassword'];
  isAuthenticated: boolean;
  isVerified: boolean;
  isAnonymous: boolean;
  
  // Additional user data from Firestore
  userProfile: UserProfile | null;
  userLoading: boolean;
  userError: Error | null;
  refreshUserProfile: () => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    loading: authLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile: updateAuthProfile,
    sendVerificationEmail,
    signInWithGoogle,
    signInAnon,
    updateUserPassword,
    isAuthenticated,
    isVerified,
    isAnonymous,
  } = useAuth();
  
  // State for additional user data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);
  
  // Fetch user profile when auth state changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid || isAnonymous) {
        setUserProfile(null);
        setUserLoading(false);
        return;
      }
      
      setUserLoading(true);
      setUserError(null);
      
      try {
        // In a real app, you would fetch the user profile from your API
        // const profile = await userService.getUserProfile(user.uid);
        // setUserProfile(profile);
        
        // For now, we'll create a basic profile from auth data
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isVerified: user.emailVerified,
          verificationRequested: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserError(error instanceof Error ? error : new Error('Failed to load user profile'));
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, isAnonymous]);
  
  // Refresh user profile data
  const refreshUserProfile = useCallback(async () => {
    if (!user?.uid || isAnonymous) return;
    
    setUserLoading(true);
    setUserError(null);
    
    try {
      // In a real app, you would refetch the user profile from your API
      // const profile = await userService.getUserProfile(user.uid);
      // setUserProfile(profile);
      
      // For now, we'll just update with the current auth data
      if (userProfile) {
        const updatedProfile: UserProfile = {
          ...userProfile,
          displayName: user.displayName || userProfile.displayName,
          photoURL: user.photoURL || userProfile.photoURL,
          email: user.email || userProfile.email,
          isVerified: user.emailVerified,
          updatedAt: new Date(),
        };
        
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      setUserError(error instanceof Error ? error : new Error('Failed to refresh user profile'));
    } finally {
      setUserLoading(false);
    }
  }, [user, userProfile, isAnonymous]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading: authLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile: updateAuthProfile,
    sendVerificationEmail,
    signInWithGoogle,
    signInAnon,
    updateUserPassword,
    isAuthenticated,
    isVerified,
    isAnonymous,
    userProfile,
    userLoading,
    userError,
    refreshUserProfile,
  }), [
    user,
    authLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateAuthProfile,
    sendVerificationEmail,
    signInWithGoogle,
    signInAnon,
    updateUserPassword,
    isAuthenticated,
    isVerified,
    isAnonymous,
    userProfile,
    userLoading,
    userError,
    refreshUserProfile,
  ]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {!authLoading ? children : <div>Loading auth...</div>}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
