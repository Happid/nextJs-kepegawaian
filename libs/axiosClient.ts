import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosClientWithAuth = () => {
  if (typeof window === "undefined") return axiosClient;

  const token = localStorage.getItem("token");
  if (token) {
    return axios.create({
      baseURL: "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return axiosClient;
};
