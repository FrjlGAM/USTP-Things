import { env } from './env';

// Application configuration
export const config = {
  // App info
  appName: 'USTP Things',
  appDescription: 'A marketplace for USTP students',
  
  // API configuration
  api: {
    baseUrl: env.REACT_APP_API_URL || 'http://localhost:5001/api',
    timeout: 30000, // 30 seconds
  },
  
  // Firebase configuration
  firebase: {
    apiKey: env.REACT_APP_FIREBASE_API_KEY,
    authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_FIREBASE_APP_ID,
    measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
  
  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    defaultPage: 1,
  },
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
  
  // UI configuration
  ui: {
    theme: {
      primaryColor: '#F88379', // Salmon pink
      secondaryColor: '#4A90E2', // Blue
      backgroundColor: '#FFFFFF',
      textColor: '#333333',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      largeDesktop: '1440px',
    },
  },
} as const;

// Application routes
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products/new',
    edit: (id: string) => `/products/${id}/edit`,
  },
  cart: '/cart',
  checkout: '/checkout',
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
  profile: {
    view: '/profile',
    edit: '/profile/edit',
    settings: '/profile/settings',
    wishlist: '/profile/wishlist',
  },
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    products: '/admin/products',
    orders: '/admin/orders',
  },
} as const;

// Available product categories
export const categories = [
  'For You',
  'Electronics',
  'Books',
  'Uniform',
  'Gel pens',
  'Graph paper',
  'School Supplies',
  'Clothing',
  'Accessories',
  'Others',
] as const;

export type Category = typeof categories[number];
