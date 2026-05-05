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

export const updateProfile = (data: unknown) => api.put("/auth/me", data);

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.put("/users/change-password", data);