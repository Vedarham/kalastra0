import api from "./axios";

export const getProductReviews = async (productId: string) => {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data;
};

export const createReview = async (data: { product: string; rating: number; title?: string; comment?: string; orderId?: string }) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const updateReview = async (id: string, data: { rating?: number; title?: string; comment?: string }) => {
  const res = await api.put(`/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};
