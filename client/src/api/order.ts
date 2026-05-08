import api from "./axios";
import { Order } from "../types/order.types";

// Create Order
export const createOrder = (data: {
  items: { product: string; quantity: number }[];
  shippingAddress: any;
}) => {
  return api.post("/orders", data);
};

// Get My Orders
export const getMyOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return api.get<{
    success: boolean;
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  }>("/orders/my", { params });
};

// Get Single Order
export const getOrderById = (id: string) => {
  return api.get<{
    success: boolean;
    order: Order;
  }>(`/orders/${id}`);
};

// Cancel Order
export const cancelOrder = (id: string, reason?: string) => {
  return api.put(`/orders/${id}/cancel`, { reason });
};


// Seller Orders
export const getSellerOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return api.get("/orders/seller/all", { params });
};

// Update Item Status (Seller)
export const updateItemStatus = (
  orderId: string,
  itemId: string,
  status: "processing" | "confirmed" | "cancelled"
) => {
  return api.put(`/orders/${orderId}/item/${itemId}`, { status });
};

// Get Seller Dashboard Stats
export const getSellerStats = async() => {
  const res = await api.get("/orders/seller/stats");
  return res.data;
};