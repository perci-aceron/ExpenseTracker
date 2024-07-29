//api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}` // Assuming token is stored in localStorage
  }
});

export default axiosInstance;
