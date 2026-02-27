import axios from "axios";

// Create an Axios instance with the backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Before every request, attach the JWT token if it exists
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
