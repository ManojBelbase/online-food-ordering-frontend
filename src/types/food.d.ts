declare namespace Food {
  interface ItemWithDetails {
    food_id: string;
    food_name: string;
    description: string;
    image?: string;
    price: number;
    isVeg: boolean;
    tags: string[];
    restaurant: {
      restaurant_id: string;
      name: string;
      address?: string;
      cuisineType?: string;
      logo?: string;
    };
    category?: {
      category_id: string;
      name: string;
    };
  }

  interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  }

  interface WithDetailsResponse {
    message: string;
    pagination: Pagination;
    items: ItemWithDetails[];
  }
}

