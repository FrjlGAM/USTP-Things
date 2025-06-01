import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { userService } from '@/api/users';
import { User, UserProfile, UserPreferences, UserAddress } from '@/types/user';

export const useUserProfile = (userId: string) => {
  return useQuery(
    queryKeys.users.profile(userId),
    () => userService.getUserProfile(userId),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ userId, data }: { userId: string; data: Partial<UserProfile> }) =>
      userService.updateUserProfile(userId, data),
    {
      onSuccess: (data, variables) => {
        // Update the user profile in the cache
        queryClient.setQueryData(
          queryKeys.users.profile(variables.userId),
          (old: UserProfile | undefined) => ({
            ...old,
            ...variables.data,
            updatedAt: new Date().toISOString(),
          })
        );
      },
    }
  );
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ userId, preferences }: { userId: string; preferences: Partial<UserPreferences> }) =>
      userService.updateUserPreferences(userId, preferences),
    {
      onSuccess: (data, variables) => {
        // Update the user preferences in the cache
        queryClient.setQueryData(
          queryKeys.users.profile(variables.userId),
          (old: UserProfile | undefined) => ({
            ...old,
            preferences: {
              ...old?.preferences,
              ...variables.preferences,
            },
            updatedAt: new Date().toISOString(),
          })
        );
      },
    }
  );
};

export const useCart = (userId: string) => {
  return useQuery(
    queryKeys.users.cart(userId),
    async () => {
      const user = await userService.getUserProfile(userId);
      return user?.cartItems || [];
    },
    {
      enabled: !!userId,
    }
  );
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ userId, productId }: { userId: string; productId: string }) =>
      userService.addToCart(userId, productId),
    {
      onSuccess: (data, variables) => {
        // Invalidate and refetch the cart
        queryClient.invalidateQueries(queryKeys.users.cart(variables.userId));
      },
    }
  );
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ userId, productId }: { userId: string; productId: string }) =>
      userService.removeFromCart(userId, productId),
    {
      onSuccess: (data, variables) => {
        // Invalidate and refetch the cart
        queryClient.invalidateQueries(queryKeys.users.cart(variables.userId));
      },
    }
  );
};

export const useWishlist = (userId: string) => {
  return useQuery(
    queryKeys.users.wishlist(userId),
    async () => {
      const user = await userService.getUserProfile(userId);
      return user?.wishlist || [];
    },
    {
      enabled: !!userId,
    }
  );
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async ({ userId, productId, isInWishlist }: { 
      userId: string; 
      productId: string;
      isInWishlist: boolean;
    }) => {
      if (isInWishlist) {
        return userService.removeFromWishlist(userId, productId);
      } else {
        return userService.addToWishlist(userId, productId);
      }
    },
    {
      onSuccess: (data, variables) => {
        // Invalidate and refetch the wishlist
        queryClient.invalidateQueries(queryKeys.users.wishlist(variables.userId));
      },
    }
  );
};

export const useRequestVerification = () => {
  return useMutation(
    (userId: string) => userService.requestVerification(userId)
  );
};
