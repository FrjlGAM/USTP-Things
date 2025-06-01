export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isVerified: boolean;
  verificationRequested: boolean;
  verificationRequestedAt?: Date;
  verifiedAt?: Date;
  role?: 'user' | 'admin' | 'seller';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
  currency: string;
  language: string;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User extends UserProfile {
  cartItems: string[];
  wishlist: string[];
  recentlyViewed: string[];
  preferences: UserPreferences;
  addresses: UserAddress[];
}
