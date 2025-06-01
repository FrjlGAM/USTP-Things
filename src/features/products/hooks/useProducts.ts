import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { productService } from '@/api/products';
import { Product, ProductFilterOptions, ProductSortOption } from '@/types/product';

export const useProducts = (
  filters?: ProductFilterOptions,
  sortBy?: ProductSortOption,
  options = {}
) => {
  return useQuery(
    queryKeys.products.list({ filters, sortBy }),
    () => productService.getProducts({ filters, sortBy }),
    {
      ...options,
      // Only enable the query if we have the required params
      enabled: !!filters && !!sortBy,
    }
  );
};

export const useProduct = (productId: string) => {
  return useQuery(
    queryKeys.products.detail(productId),
    () => productService.getProduct(productId),
    {
      enabled: !!productId,
    }
  );
};

export const useFeaturedProducts = (count: number = 4) => {
  return useQuery(
    ['featuredProducts', count],
    () => productService.getFeaturedProducts(count)
  );
};

export const useRelatedProducts = (productId: string, category: string, count: number = 4) => {
  return useQuery(
    ['relatedProducts', productId, category, count],
    () => productService.getRelatedProducts(productId, category, count),
    {
      enabled: !!productId && !!category,
    }
  );
};

// Optimistic updates for product likes
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ productId, userId }: { productId: string; userId: string }) => {
      // This would be replaced with actual API call
      return Promise.resolve();
    },
    {
      // When mutate is called:
      onMutate: async ({ productId, userId }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(queryKeys.products.all);
        
        // Snapshot the previous value
        const previousProducts = queryClient.getQueryData<Product[]>(queryKeys.products.all);
        
        // Optimistically update to the new value
        if (previousProducts) {
          queryClient.setQueryData<Product[]>(queryKeys.products.all, old => 
            (old || []).map(product => 
              product.id === productId 
                ? { ...product, liked: !product.liked } 
                : product
            )
          );
        }
        
        // Return a context object with the snapshotted value
        return { previousProducts };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context?.previousProducts) {
          queryClient.setQueryData(queryKeys.products.all, context.previousProducts);
        }
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.products.all);
      },
    }
  );
};
