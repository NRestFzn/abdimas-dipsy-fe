import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE;

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = '/masuk';
      }

      const errorData = error.response.data;
      console.error("API Error Response:", errorData);
      
      return Promise.reject(errorData);
    }

    if (error.request) {
      console.error("Network Error:", error);
      return Promise.reject({
        statusCode: 0,
        message: "Gagal terhubung ke server. Periksa koneksi internet Anda.",
        error: "Network Error",
      });
    }

    console.error("Unknown Error:", error);
    return Promise.reject(error);
  }
);
