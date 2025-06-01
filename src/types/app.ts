// App-wide types and enums

export type MainViewType =
  | 'home'
  | 'likes'
  | 'recently'
  | 'orders'
  | 'to-rate'
  | 'messages'
  | 'product'
  | 'cart'
  | 'verify'
  | 'seller'
  | 'settings';

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  theme: Theme;
  isSidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  currentView: MainViewType;
  selectedProductId: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  timestamp: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  active?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth: boolean;
  requiredRole?: string[];
}
