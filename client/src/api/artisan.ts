import api from "./axios";

export const getAllArtisans = () =>
  api.get("/artisans");

export const getArtisan = (id: string) =>
  api.get(`/artisans/${id}`);

export const getMyArtisan = () =>
  api.get(`/artisans/me`);

export const getTopCreators = async () => {
  const res = await api.get("/artisans/creator/top");
  return res.data;
};

export const followArtisan = (id: string) =>
  api.post(`/artisans/${id}/follow`);

export const unfollowArtisan = (id: string) =>
  api.post(`/artisans/${id}/unfollow`);