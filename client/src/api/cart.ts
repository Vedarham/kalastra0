import api from "./axios";

export const getCart = async () => {
  return await api.get("/cart");
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  return await api.post("/cart/add", { productId, quantity });
};

export const removeFromCart = async (productId: string) => {
  return await api.post("/cart/remove", { productId });
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  return await api.post("/cart/update", { productId, quantity });
};

export const clearCartApi = async () => {
  return await api.post("/cart/clear");
};