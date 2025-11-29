import { axiosClient } from "@/libs/axiosClient";

export const loginService = async (email: string, password: string) => {
  try {
    const response = await axiosClient.post("/JWT/login", {
      EmailId: email,
      Password: password,
    });

    return response.data; // hasil token & data user
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
