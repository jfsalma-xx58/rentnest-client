import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestId = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseId = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestId);
      axiosSecure.interceptors.response.eject(responseId);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;