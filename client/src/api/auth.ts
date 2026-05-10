import api from "./axios.ts"

export const register = (data:{
    name:string;
    email:string;
    password:string;
}) => api.post("/auth/register",data);

export const login = (data: {
  email: string;
  password: string;
}) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

export const refreshToken = () => api.post("/auth/refresh");

export const logout = () => api.post("/auth/logout");

export const updateProfile = (data: unknown) => api.put("/users/profile", data);

export const sendOtp = () => {
  return api.post("/auth/send-otp");
};

export const verifyOtp = (otp: string) => {
  return api.post("/auth/verify-otp", { otp });
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.put("/users/change-password", data);

export const becomeArtisan = async () => {
  const res = await api.post("/users/become-artisan");
  return res.data;
}

export const getWishlist = async () => {
  const res = await api.get("/users/wishlist");
  return res.data;
}

export const toggleWishlist = async (productId: string) => {
  const res = await api.post(`/users/wishlist/${productId}`);
  return res.data;
}

export const exportUserData = async () => {
  const res = await api.get("/users/export", { responseType: 'blob' });
  return res.data;
}

export const submitSupportTicket = async (data: { email?: string; subject: string; message: string }) => {
  const res = await api.post("/support", data);
  return res.data;
}