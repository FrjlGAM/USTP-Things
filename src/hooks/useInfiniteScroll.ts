import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

type UseInfiniteScrollOptions<T> = {
  /**
   * The initial page to start from (default: 1)
   */
  initialPage?: number;
  
  /**
   * The initial items to display (default: [])
   */
  initialItems?: T[];
  
  /**
   * The number of items to fetch per page (default: 10)
   */
  pageSize?: number;
  
  /**
   * The threshold in pixels before the end of the list to trigger loading more items (default: 200)
   */
  threshold?: number;
  
  /**
   * Whether to load the first page immediately (default: true)
   */
  loadOnMount?: boolean;
  
  /**
   * Whether there are more items to load (for external control)
   */
  hasMore?: boolean;
};

type FetchMoreFunction<T> = (page: number, pageSize: number) => Promise<T[]> | T[];

export function useInfiniteScroll<T>(
  /**
   * A function that fetches more items. Should return a promise that resolves to the new items.
   */
  fetchMore: FetchMoreFunction<T>,
  
  /**
   * Configuration options
   */
  options: UseInfiniteScrollOptions<T> = {}
) {
  const {
    initialPage = 1,
    initialItems = [],
    pageSize = 10,
    threshold = 200,
    loadOnMount = true,
    hasMore: externalHasMore,
  } = options;

  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(externalHasMore ?? true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLElement | null>(null);
  const isMounted = useRef(true);

  // Handle external hasMore changes
  useEffect(() => {
    if (externalHasMore !== undefined) {
      setHasMore(externalHasMore);
    }
  }, [externalHasMore]);

  // Load more items
  const loadMoreItems = useCallback(async () => {
    // Don't load if already loading or if there are no more items to load
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore(page, pageSize);
      
      // Check if the component is still mounted before updating state
      if (!isMounted.current) return;
      
      setItems(prevItems => (page === 1 ? newItems : [...prevItems, ...newItems]));
      setPage(prevPage => prevPage + 1);
      
      // If we got fewer items than requested, we've reached the end
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      
      return newItems;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to load items'));
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }
  }, [fetchMore, hasMore, loading, page, pageSize]);

  // Reset the list and load the first page
  const reset = useCallback(async () => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    setError(null);
    
    // Only load immediately if loadOnMount is true
    if (loadOnMount) {
      return loadMoreItems();
    }
    
    return [];
  }, [loadMoreItems, loadOnMount]);

  // Set up the intersection observer
  useEffect(() => {
    isMounted.current = true;
    
    // Load the first page on mount if needed
    if (loadOnMount && items.length === 0) {
      reset();
    }
    
    // Clean up on unmount
    return () => {
      isMounted.current = false;
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadOnMount, items.length, reset]);

  // Set up the intersection observer for infinite scrolling
  const setLoadMoreRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    
    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          loadMoreItems();
        }
      },
      {
        root: null, // viewport
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );
    
    // Start observing the target node
    observer.current.observe(node);
    loadMoreRef.current = node;
  }, [hasMore, loadMoreItems, loading, threshold]);

  // Manually trigger loading more items
  const loadMore = useCallback(async () => {
    return loadMoreItems();
  }, [loadMoreItems]);

  return {
    // State
    items,
    page,
    loading,
    error,
    hasMore,
    initialLoadComplete,
    
    // Refs
    loadMoreRef: setLoadMoreRef,
    
    // Actions
    loadMore,
    reset,
    setItems,
    setPage,
    setHasMore,
    
    // For manual control
    isLoading: loading,
    isInitialLoading: loading && !initialLoadComplete,
    isFetchingMore: loading && initialLoadComplete,
  };
}

// Example usage:
/*
function ProductList() {
  const fetchProducts = async (page: number, pageSize: number) => {
    const response = await fetch(`/api/products?page=${page}&limit=${pageSize}`);
    const data = await response.json();
    return data.products;
  };

  const {
    items,
    loading,
    error,
    hasMore,
    loadMoreRef,
    isInitialLoading,
    isFetchingMore,
  } = useInfiniteScroll(fetchProducts, {
    pageSize: 10,
    threshold: 200,
  });

  if (isInitialLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {isFetchingMore && <div>Loading more...</div>}
      
      <div ref={loadMoreRef} style={{ height: '1px' }} />
      
      {!hasMore && items.length > 0 && (
        <div className="mt-4 text-center text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
}
*/
