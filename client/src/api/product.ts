import api from "./axios";
import { ProductResponse, Product } from "@/types/product.types";

// AI listing generation
export const generateAIListing = async (formData: FormData) => {
  const {data} = await api.post("/products/ai-generate-listing", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Create product (after AI generation)
export const createProduct = async (data: FormData) => {
  const res = await api.post("/products", data);
  return res.data;
};

// Create product Manually
export const createManualProduct = async (data: FormData) => {
  const res = await api.post("/manual", data);
  return res.data;
};

// Get all products
export const getAllProducts = async (): Promise<ProductResponse> => {
  const {data} = await api.get("/products");
  return data;
};

// Get by category
export const getProductsByCategory = async (category: string) => {
  const res = await api.get(`/products?category=${category}`);
  return res.data;
};

// Get one product
export const getProductById = async (id: string): Promise<Product> => {
  const {data} = await api.get(`/products/${id}`);
  return data.product;
};

// Update a Product
export const updateProduct = (id: string, data: FormData) =>{
  const res = api.put(`/products/${id}`, data);
  return res;
}

// Soft Delete a Product
export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  const {data} = await api.delete(`/products/${id}`);
  return data;
};

// Seller products
export const getMyProducts = async () => {
  const res = await api.get("/products/me");
  return res.data;
};