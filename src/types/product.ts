export interface ProductBase {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  category: string;
  sellerId: string;
  sold?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product extends ProductBase {
  liked?: boolean;
}

export type ProductSortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchQuery?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
