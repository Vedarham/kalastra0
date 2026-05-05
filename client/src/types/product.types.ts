export interface ProductImage {
  url: string;
  publicId?: string;
}

export interface Artisan {
  _id: string;
  name: string;
  shopName?: string;
  avatar?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: ProductImage[];
  artisan: Artisan;
  quantity: number;
  sales?: number;
  stock?: number,
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: "cm" | "in";
  };
  weight?: {
    value?: number;
    unit?: "g" | "kg" | "oz" | "lb";
  };
  seoTags?: string[];
  reachChance?: number;
  recommendedPrice?: number;
  status?: "draft" | "active" | "sold_out" | "discontinued";
  rating?: number;
  numReviews?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}