import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Product, ProductFilterOptions, ProductListResponse, ProductSortOption } from '../types/product';

const PRODUCTS_COLLECTION = 'products';
const DEFAULT_PAGE_SIZE = 10;

export const productService = {
  // Get a single product by ID
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  // Get products with pagination and filtering
  getProducts: async (
    options: {
      page?: number;
      limit?: number;
      filters?: ProductFilterOptions;
      sortBy?: ProductSortOption;
    } = {}
  ): Promise<ProductListResponse> => {
    try {
      const {
        page = 1,
        limit: pageSize = DEFAULT_PAGE_SIZE,
        filters = {},
        sortBy = 'newest'
      } = options;

      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const queryConstraints = [];

      // Apply filters
      if (filters.category) {
        queryConstraints.push(where('category', '==', filters.category));
      }
      if (filters.minPrice !== undefined) {
        queryConstraints.push(where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice !== undefined) {
        queryConstraints.push(where('price', '<=', filters.maxPrice));
      }
      if (filters.inStock) {
        queryConstraints.push(where('stock', '>', 0));
      }
      if (filters.searchQuery) {
        // This is a simple search - consider using a full-text search solution for production
        queryConstraints.push(
          where('searchTerms', 'array-contains', filters.searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          queryConstraints.push(orderBy('price', 'asc'));
          break;
        case 'price-desc':
          queryConstraints.push(orderBy('price', 'desc'));
          break;
        case 'popular':
          queryConstraints.push(orderBy('sold', 'desc'));
          break;
        case 'newest':
        default:
          queryConstraints.push(orderBy('createdAt', 'desc'));
          break;
      }

      // Add pagination
      const offset = (page - 1) * pageSize;
      if (offset > 0) {
        // For pages after the first, we'd need to use startAfter with the last document
        // from the previous page. This requires knowing the last document.
        // For now, we'll just use offset for the first page.
        // In a real app, you'd want to implement cursor-based pagination.
      }
      queryConstraints.push(limit(pageSize));

      const q = query(productsRef, ...queryConstraints);
      const snapshot = await getDocs(q);

      // Get total count for pagination
      const countSnapshot = await getDocs(productsRef);
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / pageSize);

      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      return {
        products,
        total,
        page,
        limit: pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  // Get featured products
  getFeaturedProducts: async (count: number = 4): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isFeatured', '==', true),
        limit(count)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting featured products:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId: string, limitCount: number = 10): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', categoryId),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  },

  // Get related products (excluding the current product)
  getRelatedProducts: async (productId: string, category: string, limitCount: number = 4): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        where('__name__', '!=', productId), // Exclude current product
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting related products:', error);
      return [];
    }
  }
};
