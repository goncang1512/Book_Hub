import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "API-Key": "goncang samudera nasution",
  },
  timeout: 60 * 1000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (config) => config,
  (error) => Promise.reject(error),
);

instance.interceptors.request.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default instance;