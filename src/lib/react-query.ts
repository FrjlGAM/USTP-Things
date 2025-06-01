import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Custom query keys
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => 
      [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.products.details(), id] as const,
  },
  users: {
    all: ['users'] as const,
    profile: (userId: string) => 
      [...queryKeys.users.all, 'profile', userId] as const,
    cart: (userId: string) => 
      [...queryKeys.users.all, 'cart', userId] as const,
    wishlist: (userId: string) => 
      [...queryKeys.users.all, 'wishlist', userId] as const,
  },
};
