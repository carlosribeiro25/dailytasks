import axios from "axios";

export const api = axios.create({
  baseURL :'https://daylitask.onrender.com/',
  withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)

    }
)

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url === '/refresh') {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await api.post("/refresh", { token: refreshToken });
      const newAccessToken = res.data.accessToken;

      localStorage.setItem("token", newAccessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }

    }

    return Promise.reject(error);
  }
);


