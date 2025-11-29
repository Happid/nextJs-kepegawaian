import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://nestjs-kepegawaian-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosClientWithAuth = () => {
  if (typeof window === "undefined") return axiosClient;

  const token = localStorage.getItem("token");
  if (token) {
    return axios.create({
      baseURL: "https://nestjs-kepegawaian-production.up.railway.app",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return axiosClient;
};
