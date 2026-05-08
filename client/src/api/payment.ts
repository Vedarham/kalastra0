import api from "./axios";

export const stripeWebhook = async () => {
  return await api.post("/payments/stripe/webhook");
};

export const createPayment = async (orderId: string) => {
  return await api.post("/payments/create", { orderId, provider: "stripe" });
};

export const cancelPayment = async (orderId: string, reason?:string) => {
  return await api.post("/payments/cancel", { orderId, reason });
};