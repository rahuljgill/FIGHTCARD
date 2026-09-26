import axios from "axios";
import api from "../api/client";

export async function getCurrentUser() {
  try {
    const response = await api.get("/api/user");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw new Error("Failed to fetch current user", {
      cause: error,
    });
  }
}
